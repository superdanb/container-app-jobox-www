const fse = require('fs-extra');
const path = require('path');
const withSass = require('@zeit/next-sass');
const _ = require('lodash');


function getAssetPrefix() {
    const APP_VERSION = process.env.APP_VERSION || '0.0.1';
    return `/public/${APP_VERSION}`;
}


module.exports = withSass({
    // useFileSystemPublicRoutes: true,
    // sassLoaderOptions: {
    //     includePaths: ['sass']
    // },
    generateBuildId: async () => {
        return 'stackbit-build'
    },
    assetPrefix: getAssetPrefix(),
    exportTrailingSlash: true,
    exportPathMap: (defaultPathMap, {outDir}) => {
        const pullData = fse.readFileSync(path.join(__dirname, 'pull-data.json'), 'utf8');
        const data = JSON.parse(pullData);
        return _.reduce(data.pages, (accum, pageData) => {

            const pagePath = '/' + _.trim(pageData.url, '/');
            const queryData = _.assign({}, data, {
                page: pageData,
                path: pagePath
            });

            accum[pagePath] = {
                page: '/',
                query: queryData
            };

            if (outDir) {
                const jsonFilePath = path.join(outDir, _.trim(pagePath, '/') + '/init-props.json');
                const initPropsData = _.assign({}, queryData, {
                    server: false
                });
                fse.outputFileSync(jsonFilePath, JSON.stringify(initPropsData));
            }

            return accum;
        }, {});
    },
    webpack: (config, {dev, isServer}) => {
        // Original code at: https://github.com/zeit/next.js/blob/canary/packages/next/build/webpack-config.ts
        config.output.chunkFilename = isServer ? `[name].js` : `static/chunks/[name].js`;
        config.output.filename = '[name]';

        return config;
    }
});
