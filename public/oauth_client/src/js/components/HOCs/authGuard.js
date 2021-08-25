import React, { Component, useEffect } from 'react';
// import { connect } from 'react-redux';
import { HOME_PATH } from '../../paths/';
import { observer, inject } from "mobx-react";

const AuthGuard = inject('passportStore')(observer((props) => {

  const {passportStore} = props;

  const checkAuth = () => {
    console.log("[authGuard] checking auth");
    if(!passportStore.state.isAuthenticated || !passportStore.state.token){
      console.log('User isn\'t authenticated. decline access');
      props.history.push(HOME_PATH);
    }
  }// checkAuth

  useEffect((params) => {
    checkAuth()
  })

  return props.children;

}))//AuthGuard

export default AuthGuard;