#!/usr/bin/env node

const express = require('express');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const generateDataForDevelop = require('./utils/generateDataForDevelop');

const renderer = require('./renderer');

const port = parseInt(process.env.PORT, 10) || 3000;
const assetPrefix = `/static`;

renderer.init({assetPrefix: ''}).then((rendererInstance) => {

    const server = express();
    // const pullData = JSON.parse(fs.readFileSync(path.join(__dirname, 'dev-pull-data.json'), 'utf8'));
    const data = generateDataForDevelop({
        pagesDirPath: path.join(__dirname, 'content'),
        dataDirPath: path.join(__dirname, 'data')
    });

    // Serve static files
    server.use(assetPrefix, express.static(path.join(__dirname, assetPrefix)));
    server.use('/_next', express.static(path.join(__dirname, '.next')));

    server.get('*', (req, res) => {
        console.log(`request path: ${req.path}`);
        const reqPath = _.trim(req.path, '/');
        const page = _.find(data.pages, page => _.trim(page.url, '/') === reqPath);
        const withPage = _.assign({}, data, {page: page});
        const queryData = _.assign({
            previewId: null,
            projectId: null,
            serverRouting: true,
            assetPrefix: assetPrefix,
            path: req.path,
            server: true
        }, withPage);
        rendererInstance.nextJsApp.renderToHTML(req, res, '/', queryData).then(result => {
            res.send(result);
        });
        /*
        const options = _.assign({
            previewId: null,
            projectId: null,
            serverRouting: true,
            path: req.path,
            req: req,
            res: res,
            data: data
        });
        rendererInstance.renderPage(options).then(result => {
            res.send(result);
        });
        */
    });

    server.listen(port, (err) => {
        if (err) {
            throw err;
        }
        console.log(`> Ready on http://localhost:${port}`);
    });

});
