import React from 'react';
import { withRouter } from 'next/router';
import _ from 'lodash';

import layouts from '../layouts/index';
import { setLinkContext } from '../utils/link';

const { prefixAsset, getPages } = require('../utils');


const Index = (props) => {
    // Get the layout component from page layout
    const layout = _.get(props, 'page.frontmatter.layout');
    const Layout = layouts[_.upperFirst(_.camelCase(layout))];
    const utilityMethods = {
        prefixAsset: _.partialRight(prefixAsset, props.assetPrefix),
        getPages: _.partial(getPages, props.pages)
    };

    setLinkContext({
        previewId: props.previewId,
        serverRouting: props.serverRouting
    });

    return (
        <Layout {...props} {...utilityMethods}/>
    );
};

Index.getInitialProps = async (context) => {
    const server = _.get(context, 'query.server', false);
    // next.js will call getInitProps again when there are query params in url with all
    // the query objects and fields replaced with empty strings or casted to strings
    if (_.isBoolean(server) && server) {
        // we are on server, return the data
        return _.get(context, 'query', {});
    } else {
        // we are on client side, request the data through /init-props.json endpoint
        let url = context.asPath;
        const queryIndex = url.indexOf('?');
        if (queryIndex >= 0) {
            url = _.trimEnd(url.substring(0, queryIndex), '/') + '/init-props.json' + url.substring(queryIndex);
        } else {
            url = _.trimEnd(url, '/') + '/init-props.json';
        }
        return fetch(url).then(response => {
            return response.json();
        }).then(response => {
            if (queryIndex >= 0) {
                return _.assign(context.query, response);
            }
            return response;
        });
    }
};

export default withRouter(Index);
