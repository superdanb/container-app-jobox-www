import React from 'react';
import _ from 'lodash';

import {markdownify} from '../utils';
import CtaButtons from './CtaButtons';

export default class SectionGrid extends React.Component {
    render() {
        let section = _.get(this.props, 'section');
        return (
            <section id={_.get(section, 'id')} className={'block block-grid bg-' + _.get(section, 'bg_color')} >
              <div className="inner outer">
                {(_.get(section, 'title') || _.get(section, 'content')) && 
                <header className="block-header align-center" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="350">
                  {_.get(section, 'title') && 
                  <h2 className="block-title accent"><span>{_.get(section, 'title')}</span></h2>
                  }
                  {_.get(section, 'content') && 
                  <div className="block-subtitle">
                    {markdownify(_.get(section, 'content'))}
                  </div>
                  }
                </header>
                }
                {_.get(section, 'grid_items') && 
                <div className={'grid flex flex-col-' + _.get(section, 'columns') + ' flex-' + _.get(section, 'vert_align') + ' align-' + _.get(section, 'hor_align') + ' style-' + _.get(section, 'item_style')} data-aos="fade-up" data-aos-easing="ease" data-aos-delay="400">
                  {_.map(_.get(section, 'grid_items'), (item, item_idx) => (
                  <div key={item_idx} className="cell">
                    <div className="cell-inside">
                      {_.get(item, 'img_path') && 
                      <div className="block-img">
                        <img src={this.props.prefixAsset(_.get(item, 'img_path'))} alt={_.get(item, 'title')} />
                      </div>
                      }
                      {_.get(item, 'title') && 
                      <h3 className="block-title">{_.get(item, 'title')}</h3>
                      }
                      {_.get(item, 'content') && 
                      <div className="block-text">
                        {markdownify(_.get(item, 'content'))}
                      </div>
                      }
                      {_.get(item, 'actions') && 
                      <div className="block-btn">
                        <CtaButtons {...this.props} actions={_.get(item, 'actions')} />
                      </div>
                      }
                    </div>
                  </div>
                  ))}
                </div>
                }
              </div>
            </section>
        );
    }
}
