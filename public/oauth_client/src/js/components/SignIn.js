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


   /**
    * @module OAClient-SignIn
    * @category Auth
    * @subcategory client
    * @desc some desc
    */
   
   /**
    * @file
    */
   
   /**
    * @class OAClient-SignIn
    * @extends Component
    * @desc **SignIn component (react)**
    * location: oauth_client\src\js\components\SignIn
    *
    * @requires OAClient-actions
    * @see [OAClient-index (linkback)]{@link module:OAClient-index}
    */
   // export default class SignIn extends Component {
     @observer
     class SignIn extends Component {
       
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

          return;
          
          // We need to call some action
          // await this.props.signIn(formData)// runs the signIn action
          await this.passportStore.signIn(formData);
          
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
    this.props.history.push(`${DASHBOARD_PATH}`);
    // this.props.history.push(CORE_PATH);

    // NOTE: only for loading pages not part of this set of pages
    // if i use this it will reset the state
    // location.replace(`${location.origin}/${SUCCESS_PATH}`);
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
    // this.passportStore;
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
              placeholder="example@example.com" />
            </fieldset>
            <fieldset>
              <CustomInput
              name="password"
              type="password"
              id="password"
              label="Enter your password"
              placeholder="yoursuperpassword" />
            </fieldset>

            { this.passportStore.state.errorMessage ?
            <div className="alert alert-danger">
              { this.passportStore.state.errorMessage }
            </div>
           : null }

            <button type="submit" className="btn btn-primary" >Sign In</button>
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
            {/* beware of popup blockers which will hide the GoogleLogin & FacebookLogin btns */}
            </span>
          </div>
        </div>
      </div>
    )
  }
}// SignIn

export default SignIn;
//compose needed because of redux-form, without it just use connect
