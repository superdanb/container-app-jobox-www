import React from 'react';
import _ from 'lodash';

import {markdownify} from '../utils';
import CtaButtons from './CtaButtons';

export default class SectionCta extends React.Component {
    render() {
        let section = _.get(this.props, 'section');
        return (
            <section id={_.get(section, 'id')} className={'block block-cta bg-' + _.get(section, 'bg_color')}>
              <div className="inner outer">
                <div className="action-container">
                  <div className="action-content" data-aos="fade-up" data-aos-easing="ease" data-aos-delay="350">
                    <div className={'flex flex-middle btn-' + _.get(section, 'btn_position')}>
                      {(_.get(section, 'title') || _.get(section, 'content')) && 
                      <div className="cell block-copy">
                        {_.get(section, 'title') && 
                        <h2 className="block-title accent"><span>{_.get(section, 'title')}</span></h2>
                        }
                        {_.get(section, 'content') && 
                        <div className="block-text">
                          {markdownify(_.get(section, 'content'))}
                        </div>
                        }
                      </div>
                      }
                      {_.get(section, 'actions') && 
                      <div className="cell block-btn">
                        <CtaButtons {...this.props} actions={_.get(section, 'actions')} />
                      </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </section>
        );
    }
}