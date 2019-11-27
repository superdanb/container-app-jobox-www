import React from 'react';
import _ from 'lodash';

import {markdownify} from '../utils';
import CtaButtons from './CtaButtons';

export default class SectionFeatures extends React.Component {
    render() {
        let section = _.get(this.props, 'section');
        return (
            <section id={_.get(section, 'id')} className={'block block-features bg-' + _.get(section, 'bg_color')}>
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
                {_.get(section, 'features') && 
                _.map(_.get(section, 'features'), (feature, feature_idx) => (
                <div key={feature_idx} className={'flex flex-middle flex-col-two media-' + _.get(feature, 'media_position')}>
                  {_.get(feature, 'img_path') ? 
                  <div className="cell block-img align-center" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="380">
                    <img src={this.props.prefixAsset(_.get(feature, 'img_path'))} alt={_.get(feature, 'title')} />
                  </div>
                   : (_.get(feature, 'video_embed') && 
                  <div className="cell block-video align-center" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="380">
                    {markdownify(_.get(feature, 'video_embed'))}
                  </div>
                  )}
                  <div className="cell block-copy" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="400">
                    {_.get(feature, 'title') && 
                    <h3 className="block-title accent"><span>{_.get(feature, 'title')}</span></h3>
                    }
                    {_.get(feature, 'content') && 
                    <div className="block-text">
                      {markdownify(_.get(feature, 'content'))}
                    </div>
                    }
                    {_.get(feature, 'actions') && 
                    <div className="block-btn">
                      <CtaButtons {...this.props} actions={_.get(feature, 'actions')} />
                    </div>
                    }
                  </div>
                </div>
                ))
                }
              </div>
            </section>
        );
    }
}
