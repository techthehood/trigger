import React, {Component} from 'react';

export default class CustomInput extends Component {
  render(){
    const { value = "", onChange, name } = this.props;
    return (
      <div className="form-group">
      <label htmlFor={this.props.id} >{ this.props.label }</label>
      <input name={name}
      id={this.props.id}
      placeholder={this.props.placeholder}
      className="form-control"
      type={this.props.type}
      defaultValue={value}
      // onChange={onChange}
      />
      </div>
    );
  }
}

//<input name={this.props.name}
