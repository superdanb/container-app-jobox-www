const _ = require('lodash');

export default function(url) {
    if (_.startsWith(url, '#') || _.startsWith(url, 'http')) {
        return url;
    }
    return url;
}
