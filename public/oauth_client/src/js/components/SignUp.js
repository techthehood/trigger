import React, {Component} from 'react';
// import {reduxForm, Field} from 'redux-form'
// import { connect } from 'react-redux';
// import { compose } from 'redux';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

// import * as actions from '../actions/';
import { DASHBOARD_PATH, SUCCESS_PATH } from '../paths/';
// import { CORE_PATH } from '../paths/';
import CustomInput from './CustomInput';

import { observer, inject } from "mobx-react";
// inject('passportStore')(observer(
// const { passportStore } = props;

/**
 * @module
 * @name OAClient-SignUp
 * @category Auth
 * @subcategory client
 * @desc SignUp component
 */

/**
 * @file
 */

// export default class SignUp extends Component {

/**
 * **SignUp React Component**
 * @extends Component
 */
@observer
class SignUp extends Component {

  constructor(props){
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
    this.passportStore = this.props.store;
    this.form_data = this.passportStore.form_data;
  }

async onSubmit(formData){
  console.log('onSubmit called!');
  console.log("[formData]",formData);

  // We need to call some action
  // await this.props.signUp(formData)// runs the signUp action
  await this.passportStore.signUp(formData)

  if(!this.passportStore.state.errorMessage){
    //dashboard redirect
    console.log("headed to the dashboard");
    // this.props.history.push(DASHBOARD_PATH);
    // this.props.history.push(CORE_PATH);
    location.replace(`${location.origin}/${SUCCESS_PATH}`);
  }// if
}

async responseGoogle(res){
  console.log('responseGoogle', res);

  // await this.props.oauthGoogle(res.accessToken);
  await this.passportStore.oauthGoogle(res.accessToken);

  if(!this.passportStore.state.errorMessage){
    //dashboard redirect
    console.log("headed to the dashboard");
    // this.props.history.push(DASHBOARD_PATH);
    // this.props.history.push(CORE_PATH);
    location.replace(`${location.origin}/${SUCCESS_PATH}`);
  }// if
}// responseGoogle

async responseFacebook(res){
  console.log('responseFacebook', res);

  // await this.props.oauthFacebook(res.accessToken);
  await this.passportStore.oauthFacebook(res.accessToken);

    if(!this.passportStore.state.errorMessage){
      console.log("headed to the dashboard");
      //dashboard redirect
      // this.props.history.push(DASHBOARD_PATH);
      // this.props.history.push(CORE_PATH);
      location.replace(`${location.origin}/${SUCCESS_PATH}`);
    }// if
}// responseFacebook

  render(){
    const { handleSubmit } = this.form_data;
    return (
      <div className="row">
        <div className="col auth_form">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <fieldset>
              <CustomInput
              name="email"
              type="text"
              id="email"
              label="Enter your email"
              placeholder="example@example.com"
              />
            </fieldset>
            <fieldset>
              <CustomInput
              name="password"
              type="password"
              id="password"
              label="Enter your password"
              placeholder="yoursuperpassword"
              />
            </fieldset>

            { this.passportStore.state.errorMessage ?
            <div className="alert alert-danger">
              { this.passportStore.state.errorMessage }
            </div>
           : null }

            <button type="submit" className="btn btn-primary" >Sign Up</button>
          </form>
        </div>
        <div className="col auth_form">
          <div className="text-center social_wrapper">
            <div className="alert alert-primary">
              Or sign up using third party services
            </div>
            {/*<button className="btn btn-default" >Google</button>*/}
            <FacebookLogin
              appId="460223747894882"
              /*autoLoad={true}*/
              textButton="Facebook"
              fields="name,email,picture"
              callback={this.responseFacebook}
              cssClass="btn btn-outline-primary"
            />
            <span style={{transition: "opacity 0.5s ease 0s"}}>
              <GoogleLogin
               clientId="1033836948812-fbkvifqukbtlg2kvorn88jokcpcrdf7k.apps.googleusercontent.com"
               buttonText="Google"
               onSuccess={this.responseGoogle}
               onFailure={this.responseGoogle}
               className="btn btn-outline-danger"
              />
            </span>
          </div>
        </div>
      </div>
    )
  }
}// SignUp

export default SignUp;
//compose needed because of redux-form, without it just use connect
