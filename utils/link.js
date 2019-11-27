import React from 'react';
import NextLink from 'next/link';
import _ from 'lodash';

let context = {};

// Use Next link for internal routes
export default function Link({ children, to, ...rest }) {
    // We assume that internal routes are these starting with exactly one slash
    // and does not starts with "//", "http" or "#"
    // will start with exactly one slash, and that anything else is external.
    const internal = !/^(?:https?:|\/\/|#)/.test(to);
    const serverRouting = _.get(context, 'serverRouting', false);

    if (internal && _.get(context, 'previewId')) {
        to += (to.indexOf('?') === -1 ? '?' : '&') + 'preview=' + _.get(context, 'previewId');
    }

    if (internal && !serverRouting) {
        return (
            <NextLink href='/' as={to}>
                <a {...rest}>{children}</a>
            </NextLink>
        )
    }

    return (
        <a href={to} {...rest}>
            {children}
        </a>
    )
}

export function setLinkContext(_context) {
    context = _context;
}
