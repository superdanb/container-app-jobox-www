import React from 'react';
import _ from 'lodash';

export default class FieldInput extends React.Component {
    render() {
        return (
            <p className="form-row">
              <label className="form-label">{_.get(this.props, 'field.label')}</label>
              {(_.get(this.props, 'field.input_type') === 'textarea') ? 
              <textarea name={_.get(this.props, 'field.name')} rows="7"/>
               : 
              <input type={_.get(this.props, 'field.input_type')} name={_.get(this.props, 'field.name')}/>
              }
            </p>
        );
    }
}