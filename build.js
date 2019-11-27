#!/usr/bin/env node

const renderer = require('./renderer');
const publicDir = 'public';

renderer.init().then(rendererInstance => {
    return rendererInstance.copyStaticFiles(publicDir);
});
