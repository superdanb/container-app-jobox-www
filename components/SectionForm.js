import React from 'react';
import _ from 'lodash';

import {markdownify} from '../utils';
import components from './index';

export default class SectionForm extends React.Component {
    render() {
        let section = _.get(this.props, 'section');
        return (
            <section id={_.get(section, 'id')} className={'block block-form bg-' + _.get(section, 'bg_color')} data-aos="fade-up" data-aos-easing="ease" data-aos-delay="400">
              <div className="inner outer">
                {(_.get(section, 'title') || _.get(section, 'content')) && 
                <div className="block-copy">
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
                <div className="form-container">
                  <form name="contactForm" {...(_.get(section, 'form_action') ? {action: _.get(section, 'form_action')} : null)} method="POST"
                    className={'style-' + _.get(section, 'form_style')}>
                    {_.map(_.get(section, 'form_fields'), (field, field_idx) => {
                        let GetFieldComponent = components[_.get(field, 'component')];
                        return (
                        <GetFieldComponent key={field_idx} {...this.props} field={field} />
                        )
                    })}
                    <p className="form-row form-submit">
                      <button type="submit">{_.get(section, 'form_btn_label') || 'Send'}</button>
                    </p>
                  </form>
                </div>
              </div>
            </section>
        );
    }
}
