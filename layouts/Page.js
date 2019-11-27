import React from 'react';
import _ from 'lodash';

import BaseLayout from './BaseLayout';
import {markdownify, htmlToReact} from '../utils';

export default class Page extends React.Component {
    render() {
        return (
            <BaseLayout {...this.props}>
            <article className="post" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="350">
              <div className="outer inner">
                <header className="post-header">
                  <h1 className="post-title">{_.get(this.props, 'page.frontmatter.title')}</h1>
                </header>
                {_.get(this.props, 'page.frontmatter.img_path') && 
                <div className="post-thumbnail">
                  <img src={this.props.prefixAsset(_.get(this.props, 'page.frontmatter.img_path'))} alt={_.get(this.props, 'page.frontmatter.title')} />
                </div>
                }
                {_.get(this.props, 'page.frontmatter.subtitle') && 
                <div className="post-subtitle">
                  {htmlToReact(_.get(this.props, 'page.frontmatter.subtitle'))}
                </div>
                }
                <div className="post-content">
                  {markdownify(_.get(this.props, 'page.markdown'))}
                </div>
              </div>
            </article>
            </BaseLayout>
        );
    }
}
