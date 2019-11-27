import React from 'react';
import _ from 'lodash';

import {markdownify} from '../utils';
import CtaButtons from './CtaButtons';

export default class SectionHero extends React.Component {
    render() {
        let section = _.get(this.props, 'section');
        return (
            <section id={_.get(section, 'id')} className={'block block-hero bg-' + _.get(section, 'bg_color')}>
              <div className="inner outer">
                <div className={'flex flex-middle flex-col-two media-' + _.get(section, 'media_position')}>
                  {_.get(section, 'img_path') ? 
                  <div className="cell block-img align-center" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="380">
                    <img src={this.props.prefixAsset(_.get(section, 'img_path'))} alt={_.get(section, 'title')} />
                  </div>
                   : (_.get(section, 'video_embed') && 
                  <div className="cell block-video align-center" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="380">
                    {markdownify(_.get(section, 'video_embed'))}
                  </div>
                  )}
                  {((_.get(section, 'title') || _.get(section, 'content')) || _.get(section, 'actions')) && 
                  <div className="cell block-copy" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="400">
                    {_.get(section, 'title') && 
                    <h1 className="block-title">{_.get(section, 'title')}</h1>
                    }
                    {_.get(section, 'content') && 
                    <div className="block-text">
                      {markdownify(_.get(section, 'content'))}
                    </div>
                    }
                    {_.get(section, 'actions') && 
                    <div className="block-btn">
                      <CtaButtons {...this.props} actions={_.get(section, 'actions')} />
                    </div>
                    }
                  </div>
                  }
                </div>
              </div>
            </section>
        );
    }
}
