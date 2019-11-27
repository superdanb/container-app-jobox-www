const _ = require('lodash');

export default function prefixAsset(assetUrl, assetPrefix) {
    if (_.isEmpty(assetPrefix) || !assetUrl || assetUrl.startsWith('http')) {
        return assetUrl;
    }
    return '/' + _.trim(assetPrefix, '/') + '/' + _.trimStart(assetUrl, '/');
}
