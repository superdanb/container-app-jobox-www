const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const toml = require('@iarna/toml');
const _ = require('lodash');
const readDirRecSync = require('./readDirRecSync');


module.exports = function({pagesDirPath, dataDirPath}) {
    // const page = parseFileSync(path.join(__dirname, '../content/index.md'));
    const pageFiles = readDirRecSync(pagesDirPath);
    const pages = _.reduce(pageFiles, (accum, pageFile) => {
        const pathObject = path.parse(pageFile);
        const ext = pathObject.ext.substring(1);
        if (ext === 'md') {
            const pageData = parseFileSync(pageFile);
            const relativeDir = path.relative(pagesDirPath, pathObject.dir);
            let url = relativeDir;
            if (pathObject.name !== 'index') {
                url += (_.isEmpty(url) ? '' : '/') + pathObject.name;
            }
            url = _.isEmpty(url) ? '/' : `/${url}`;
            accum.push({
                url: url,
                relativePath: path.relative(pagesDirPath, pageFile),
                relativeDir: relativeDir,
                base: pathObject.base,
                name: pathObject.name,
                frontmatter: pageData.frontmatter,
                markdown: pageData.markdown,
            });
        }
        return accum;
    }, []);
    const dataFiles = getFilesInDir(dataDirPath);
    const data = _.reduce(dataFiles, (accum, dataFile) => {
        const pathObject = path.parse(dataFile);
        const name = pathObject.name;
        const ext = pathObject.ext.substring(1);
        if (_.includes(['yml', 'yaml', 'json', 'toml', 'md'], ext)) {
            accum[name] = parseFileSync(dataFile);
        }
        return accum;
    }, {});
    return {
        page: null,
        pages: pages,
        data: data,
        site: {}
    }
};

function getFilesInDir(dir) {
    const files = fs.readdirSync(dir);
    return _.reduce(files, (accum, fileName) => {
        const filePath = path.join(dir, fileName);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            accum.push(filePath);
        }
        return accum;
    }, []);
}

function parseFileSync(filePath) {
    let data = fs.readFileSync(filePath, 'utf8');
    return parseDataByFilePath(data, filePath);
}

function parseDataByFilePath(string, filePath) {
    const extension = path.extname(filePath).substring(1);
    let data;
    switch (extension) {
        case 'yml':
        case 'yaml':
            data = yaml.safeLoad(string, {schema: yaml.JSON_SCHEMA});
            break;
        case 'json':
            data = JSON.parse(string);
            break;
        case 'toml':
            data = toml.parse(string);
            break;
        case 'md':
            data = parseMarkdownWithFrontMatter(string);
            break;
        default:
            throw new Error(`parseDataByFilePath error, extension '${extension}' of file ${filePath} is not supported`);
    }
    return data;
}

function parseMarkdownWithFrontMatter(string) {
    let frontmatter = null;
    let markdown = string;
    let frontMatterTypes = [
        {
            type: 'yaml',
            startDelimiter: '---\n',
            endDelimiter: '\n---',
            parse: (string) => yaml.safeLoad(string, {schema: yaml.JSON_SCHEMA})
        },
        {
            type: 'toml',
            startDelimiter: '+++\n',
            endDelimiter: '\n+++',
            parse: (string) => toml.parse(string)
        },
        {
            type: 'json',
            startDelimiter: '{\n',
            endDelimiter: '\n}',
            parse: (string) => JSON.parse(string)
        }
    ];
    _.forEach(frontMatterTypes, fmType => {
        if (string.startsWith(fmType.startDelimiter)) {
            let index = string.indexOf(fmType.endDelimiter);
            if (index !== -1) {
                // The end delimiter must be followed by EOF or by a new line (possibly preceded with spaces)
                // For example ("." used for spaces):
                //   |---
                //   |title: Title
                //   |---...
                //   |
                //   |Markdown Content
                //   |
                // "index" points to the beginning of the second "---"
                // "endDelimEndIndex" points to the end of the second "---"
                // "afterEndDelim" is everything after the second "---"
                // "afterEndDelimMatch" is the matched "...\n" after the second "---"
                // frontmatter will be: {title: "Title"}
                // markdown will be "\nMarkdown Content\n" (the first \n after end delimiter is discarded)
                let endDelimEndIndex = index + fmType.endDelimiter.length;
                let afterEndDelim = string.substring(endDelimEndIndex);
                let afterEndDelimMatch = afterEndDelim.match(/^\s*?(\n|$)/);
                if (afterEndDelimMatch) {
                    let data = string.substring(fmType.startDelimiter.length, index);
                    frontmatter = fmType.parse(data);
                    markdown = afterEndDelim.substring(afterEndDelimMatch[0].length);
                }
            }
        }
    });
    return {
        frontmatter: frontmatter,
        markdown: markdown
    };
}
