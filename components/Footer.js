import React from 'react';
import _ from 'lodash';

import {Link, safePrefix, markdownify} from '../utils';

export default class Footer extends React.Component {
    render() {
        return (
            <footer id="colophon" className="site-footer">
              <div className="outer inner">
                <div className="footer-top">
                  <div className="footer-branding">
                    {_.get(this.props, 'data.footer.logo_path') ? 
                    <p className="site-logo">
                      <Link to={safePrefix('/')}><img src={this.props.prefixAsset(_.get(this.props, 'data.footer.logo_path'))}
                          alt="Logo" /></Link>
                    </p>
                     : 
                    <p className="site-title">
                      <Link to={safePrefix('/')}>{_.get(this.props, 'siteMetadata.title')}</Link>
                    </p>
                    }
                  </div>
                  {_.get(this.props, 'data.footer.has_social') && 
                  <div className="social-links">
                    {_.map(_.get(this.props, 'data.footer.social_links'), (link, link_idx) => (
                    <Link key={link_idx} to={_.get(link, 'url')} className={'btn ' + _.get(link, 'type')} {...(_.get(link, 'new_tab') ? {target: '_blank', rel: 'noopener'} : null)}>{_.get(link, 'label')}</Link>
                    ))}
                  </div>
                  }
                </div>
                <div className="footer-bottom">
                  {(_.get(this.props, 'data.footer.has_nav') && _.get(this.props, 'data.footer.menu_items')) && 
                  <nav id="secondary-nav" className="footer-nav">
                    <ul className="menu">
                      {_.map(_.get(this.props, 'data.footer.menu_items'), (item, item_idx) => (
                      <li key={item_idx} className={'menu-item' + ((_.get(item, 'type') !== 'link') ? ' menu-btn' : '')}>
                        <Link to={safePrefix(_.get(item, 'url'))} className={'btn ' + _.get(item, 'type')}>{_.get(item, 'label')}</Link>
                      </li>
                      ))}
                    </ul>
                  </nav>
                  }
                  {_.get(this.props, 'data.footer.text') && 
                  <div className="site-info">
                    {markdownify(_.get(this.props, 'data.footer.text'))}
                  </div>
                  }
                </div>
              </div>
            </footer>
        );
    }
}
