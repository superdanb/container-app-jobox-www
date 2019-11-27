import React from 'react';
import _ from 'lodash';

import {Link, safePrefix, classNames} from '../utils';

export default class CtaButtons extends React.Component {
    render() {
        return (
            _.map(_.get(this.props, 'actions'), (action, action_idx) => (
            <Link key={action_idx} to={(_.get(action, 'url').startsWith('#') ? _.get(action, 'url') : safePrefix(_.get(action, 'url')))} className={classNames('btn', _.get(action, 'type'))}{...(_.get(action, 'new_tab') ? {target: '_blank', rel: 'noopener'} : null)}><span>{_.get(action, 'label')}</span></Link>
            ))
        );
    }
}
