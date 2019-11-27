const path = require('path');
const _ = require('lodash');

module.exports = function(pullData, reqPath) {
    if (!_.isNil(reqPath)) {
        reqPath = reqPath.replace(/(^|\/)index.html$/, '');
        reqPath = _.trim(reqPath, '/');
    }
    return _.reduce(pullData, (accum, entry) => {
        // const filePath = _.get(entry, 'filePath');
        // const modelType = modelTypeFromFilePath(filePath);
        const modelType = _.get(entry, 'modelType');
        if (modelType === 'page') {
            const urlPath = _.get(entry, 'urlPath');
            const filePath = _.get(entry, 'filePath');
            const pathObject = path.parse(filePath);
            const page = {
                url: urlPath,
                relativePath: path.relative('content', filePath),
                relativeDir: path.relative('content', pathObject.dir),
                base: pathObject.base,
                name: pathObject.name,
                frontmatter: _.omit(entry.data, ['content']),
                markdown: _.get(entry.data, 'content'),
            };
            accum.pages.push(page);
            if (!_.isNil(reqPath) && reqPath === _.trim(urlPath, '/')) {
                accum.page = page;
            }
        } else if (modelType === 'data') {
            accum.data[entry.modelName] = entry.data;
        }
        return accum;
    }, {
        page: null,
        pages: [],
        data: {},
        site: {}
    });
};

function modelTypeFromFilePath(filePath) {
    if (!filePath) {
        return modelType;
    }
    const fileExt = path.extname(filePath).substring(1);
    if (fileExt === 'md') {
        return 'page';
    } else if (fileExt === 'json') {
        return 'data';
    }
}
