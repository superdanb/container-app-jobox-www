import React from 'react';
import _ from 'lodash';

import BaseLayout from './BaseLayout';
import components from '../components/index';

export default class Custom extends React.Component {
    render() {
        return (
            <BaseLayout {...this.props}>
            {_.map(_.get(this.props, 'page.frontmatter.sections'), (section, section_idx) => {
                let GetSectionComponent = components[_.get(section, 'component')];
                return (
                  <GetSectionComponent key={section_idx} {...this.props} section={section} site={this.props.site} />
                )
            })}
            </BaseLayout>
        );
    }
}