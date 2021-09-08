import React, { Component, useEffect } from 'react';
// import { connect } from 'react-redux';
import { HOME_PATH, CHAT_PATH } from '../../paths/';
import { observer, inject } from "mobx-react";
import { useParams, useHistory, useLocation } from 'react-router-dom';
//https://www.freecodecamp.org/news/a-complete-beginners-guide-to-react-router-include-router-hooks/
import { PassportContext } from '../../passportContext';

const AuthGuard = observer((props) => {

  const passportStore = props.store;
  const history = useHistory();
  // const passportStore = useContext(PassportContext);

  const checkAuth = () => {
    console.log("[authGuard] checking auth");
    if(!passportStore.state.isAuthenticated || !passportStore.state.token){
      console.log('User isn\'t authenticated. decline access');
      history.push(HOME_PATH);
    }
  }// checkAuth

  useEffect((params) => {
    checkAuth()
  })

  return props.children;

});//AuthGuard

export default AuthGuard;