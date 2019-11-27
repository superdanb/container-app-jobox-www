import React from 'react';
import _ from 'lodash';

export default class FieldSelect extends React.Component {
    render() {
        return (
            <p className="form-row">
              <label className="form-label">{_.get(this.props, 'field.label')}</label>
              <select name={_.get(this.props, 'field.name')}{...(_.get(this.props, 'field.is_multiple') ? {multiple: true} : null)}>
                {_.get(this.props, 'field.default_option') && 
                <option value="">{_.get(this.props, 'field.default_option')}</option>
                }
                {_.map(_.get(this.props, 'field.options'), (option, option_idx) => (
                <option key={option_idx} value={_.get(option, 'value')}>{_.get(option, 'label')}</option>
                ))}
              </select>
            </p>
        );
    }
}
