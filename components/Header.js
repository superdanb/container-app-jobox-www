import React from 'react';
import _ from 'lodash';

import {Link, safePrefix} from '../utils';

export default class Header extends React.Component {
    render() {
        return (
            <header id="masthead" className="site-header">
              <div className="inner outer">
                <div className="site-header-inside">
                  <div className="site-branding">
                    {_.get(this.props, 'data.header.logo_path') && 
                    <p className="site-logo">
                      <Link to={safePrefix('/')}><img src={this.props.prefixAsset(_.get(this.props, 'data.header.logo_path'))} alt="Logo" /></Link>
                    </p>
                    }
                    <p className="site-title">
                      <Link to={safePrefix('/')}>{_.get(this.props, 'siteMetadata.title')}</Link>
                    </p>
                  </div>
                  {(_.get(this.props, 'data.header.has_nav') && _.get(this.props, 'data.header.menu_items')) && <React.Fragment>
                  <nav id="main-nav" className="site-nav" aria-label="Main Navigation">
                    <div className="site-nav-inside">
                      <button id="menu-close" className="menu-toggle"><span className="visually-hidden">Hide Menu</span><span
                          className="icon-close" aria-hidden="true" /></button>
                      <ul className="menu">
                        {_.map(_.get(this.props, 'data.header.menu_items'), (item, item_idx) => (
                        <li key={item_idx} className={'menu-item' + ((_.get(item, 'type') !== 'link') ? ' menu-btn' : '') + ((_.get(this.props, 'url') === _.get(item, 'url')) ? ' current-menu-item' : '')}>
                          <Link to={safePrefix(_.get(item, 'url'))} className={'btn ' + _.get(item, 'type')}>{_.get(item, 'label')}</Link>
                        </li>
                        ))}
                      </ul>
                    </div>
                  </nav>
                  <button id="menu-open" className="menu-toggle"><span className="visually-hidden">Show Menu</span><span className="icon-menu"
                      aria-hidden="true" /></button>
                  </React.Fragment>}
                </div>
              </div>
            </header>
        );
    }
}
