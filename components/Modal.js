import React from 'react';
import _ from 'lodash';

import {markdownify} from '../utils';
import CtaButtons from './CtaButtons';

export default class Modal extends React.Component {
    render() {
        return (
            <section id="modal" className="modal" tabIndex="-1" role="dialog">
              <div className="modal-inside">
                <div className="modal-content">
                  <button id="modal-close"><span className="visually-hidden">Close</span><span className="icon-close" aria-hidden="true" /></button>
                  <div className="modal-copy">
                    {_.get(this.props, 'data.modal.img_path') && 
                    <div className="modal-img">
                      <img src={this.props.prefixAsset(_.get(this.props, 'data.modal.img_path'))} alt={_.get(this.props, 'data.modal.title')} />
                    </div>
                    }
                    {_.get(this.props, 'data.modal.title') && 
                    <h2 className="modal-title">{_.get(this.props, 'data.modal.title')}</h2>
                    }
                    {_.get(this.props, 'data.modal.content') && 
                    <div className="modal-text">
                      {markdownify(_.get(this.props, 'data.modal.content'))}
                    </div>
                    }
                    {_.get(this.props, 'data.modal.actions') && 
                    <div className="modal-cta">
                      <CtaButtons {...this.props} actions={_.get(this.props, 'data.modal.actions')} />
                    </div>
                    }
                  </div>
                </div>
              </div>
            </section>
        );
    }
}