const fs = require('fs');
const path = require('path');
const _ = require('lodash');

module.exports = readDirRecSync;

/**
 * @param {string} dir
 * @param {object} [options]
 * @return {Array<string>}
 */
function readDirRecSync(dir, options) {
    const files = fs.readdirSync(dir);
    return _.reduce(files, (accum, fileName) => {
        const filePath = path.join(dir, fileName);
        if (_.has(options, 'filter') && !options.filter(filePath)) {
            return accum;
        }
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            accum = accum.concat(readDirRecSync(filePath, options));
        } else if (stats.isFile()) {
            accum.push(filePath);
        }
        return accum;
    }, []);
}
