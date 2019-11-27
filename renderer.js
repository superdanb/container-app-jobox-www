const { spawn } = require('child_process');
const path = require('path');
const fse = require('fs-extra');
const _ = require('lodash');

const transformPullData = require('./utils/transformPullData');

const APP_DIR = __dirname;
const next = require(path.join(APP_DIR, 'node_modules/next'));

function buildNext() {
    return new Promise((resolve, reject) => {
        console.log('building next.js app...');
        const build = spawn('./node_modules/.bin/next', ['build'], {
            cwd: path.join(APP_DIR),
            stdio: ['pipe', process.stdout, 'pipe']
        });

        let stderr = '';
        build.stderr.on('data', (data) => {
            stderr += String(data);
        });

        build.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
            if (code === 0) {
                console.log('next.js app has been built');
                resolve();
            } else {
                reject(new Error(stderr));
            }
        });
    });
}

function initApp(options) {
    console.log('initializing next.js app...');
    const nextJsApp = next({
        dev: _.get(options, 'dev', false),
        dir: APP_DIR
    });
    return nextJsApp.prepare().then(() => {
        console.log('next.js app ready');
        return nextJsApp;
    });
}

class Renderer {

    constructor(nextJsApp, options) {
        const assetPrefix = _.get(options, 'assetPrefix', '');
        this.nextJsApp = nextJsApp;
        this.assetPrefix = assetPrefix + '/static';
        if (this.assetPrefix) {
            this.nextJsApp.setAssetPrefix(assetPrefix);
        }
    }

    copyStaticFiles(dest) {
        const nextJsFiles = path.join(APP_DIR, '.next');
        const staticFiles = path.join(APP_DIR, 'static');
        fse.copySync(nextJsFiles, path.join(dest, '_next'));
        fse.copySync(staticFiles, path.join(dest, 'static'));
        return Promise.resolve(this);
    }

    bundle(options) {
        const queryData = _.assign({
            previewId: options.previewId,
            projectId: options.projectId,
            serverRouting: false,
            assetPrefix: this.assetPrefix,
            path: null,
            server: true
        }, transformPullData(options.data, null));

        return new Promise((resolve, reject) => {

            const outFolderPath = path.join(APP_DIR, 'out');

            // save pull-data.json so it will be picked up by next.config.js when running "next export"
            console.log('creating pull-data.json for next.js export');
            fse.writeFileSync(path.join(APP_DIR, 'pull-data.json'), JSON.stringify(queryData));

            // remove "out" folder is exists
            console.log('removing out folder');
            fse.removeSync(outFolderPath);

            // run "next export"
            console.log('exporting next.js app...');
            const build = spawn('./node_modules/.bin/next', ['export'], {
                cwd: path.join(APP_DIR),
                stdio: ['pipe', process.stdout, 'pipe']
            });

            let stderr = '';
            build.stderr.on('data', (data) => {
                stderr += String(data);
            });

            build.on('close', (code) => {
                console.log(`command "next export" exited with code ${code}`);
                if (code === 0) {
                    console.log('next.js app has been exported');

                    // ignore _next and static files as these are exported
                    // globally in copyStaticFiles() when container deploys.
                    // These folders are copied to "out" folder "as is" by next when exporting
                    resolve({
                        folder: outFolderPath,
                        filter: (filePath) => !_.includes([
                            path.join(APP_DIR, 'out', '_next'),
                            path.join(APP_DIR, 'out', 'static'),
                        ], filePath)
                    });
                } else {
                    reject(new Error(stderr));
                }
            });
        });
    }

    renderPage(options) {
        let path = options.path;
        let server = true;
        if (/(?:^|\/)init-props\.json/.test(options.path)) {
            path = options.path.replace('init-props.json', '');
            server = false;
        }
        const data = transformPullData(options.data, path);
        const queryData = _.assign({
            previewId: options.previewId,
            projectId: options.projectId,
            serverRouting: _.get(options, 'serverRouting', true),
            assetPrefix: this.assetPrefix,
            path: path,
            server: server
        }, data);
        if (server) {
            return this.nextJsApp.renderToHTML(options.req, options.res, '/', queryData);
        } else {
            return Promise.resolve(JSON.stringify(queryData));
        }
    }

}

module.exports = {

    init: (options) => {
        return buildNext().then(() => {
            return initApp(options);
        }).then((nextJsApp) => {
            return new Renderer(nextJsApp, options);
        });
    }

};
