import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route} from 'react-router-dom';

// import { createStore, applyMiddleware } from 'redux';
// import { Provider } from 'react-redux';
import { Provider as MobxProvider } from 'mobx-react';
// import reduxThunk from 'redux-thunk';
import axios from 'axios';


const passportStore = require('./passportStore').default;


// import * as serviceWorker from './serviceWorker';

import App from "./components/App";
import Home from "./components/Home";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import AuthGuard from "./components/HOCs/authGuard";
import Dashboard from "./components/Dashboard";
// import reducers from "./reducers/";
require("./components/components.scss");

/**
 * @module
 * @name OAClient-index
 * @category Auth
 * @subcategory init
  * @desc
  * ### The auth process <br>
  * <br>
  * <strong>google login</strong>
  * <ul>
  * <li>[click social login btn]{@link module:OAClient-SignUp}</li>
  * <li>[an action is called]{@link module:OAClient-actions}</li>
  * <li>[the action takes the social login data and adds it to a verification request]{@link module:OAServer-routers-oauth}</li>
  * <li>[the router passes the request to cors then to a passport strategy]{@link module:passport}</li>
  * <li>passport verifies the data at its home site and brings back more validation data</li>
  * <li>the returned data is added to new user data or compared to current user data</li>
  * <li>[default data is created (initiate_starter_data) and a token is created (signToken)]{@link module:OAServer-controllers-users}</li>
  * <li>[the token is sent back in a response to the called action]{@link module:OAClient-actions}</li>
  * <li>[the token is dispatched to the reducer]{@link module:OAClient-reducers-auth}</li>
  * <li>the action then saves to localStorage and sets the axios request header</li>
  * <li>[the reducer updates the state/store's property values then the action returns to the component]{@link module:OAClient-SignUp}</li>
  * <li>if there are no errors recorded by the reducer in the state, the component is then free to call a redirect</li>
  * </ul>
  * <br>
  * <code>//code example </code>
  * @requires OAClient-App
  * @see OAClient-SignIn
 */

/**
 * @file
 */

import { HOME_PATH, SIGN_UP_PATH, SIGN_IN_PATH, DASHBOARD_PATH } from './paths/'

const jwtToken = localStorage.getItem('JWT_TOKEN');

passportStore.setAuth(jwtToken);

console.log("[jwtToken]", jwtToken);
axios.defaults.headers.common['Authorization'] = jwtToken;

console.log(`[trigger] index.js`,HOME_PATH);


ReactDOM.render(
  /*<Provider store={createStore(reducers, {})}>*/
  /**
   * @member Provider
   * @type {Object}
   * @desc react-redux Provider to connect components with the redux store
   * // NOW: Auth - test user can be created but doesn't add info directories. document where init dir are created
   */

  /**
   * @inner
   * @name note-name
   * @desc
   * # note title <br>
   * <br>
   * <p>note body text </p>
   * <br>
   * <code>//code example </code>
   * @requires reduxThunk applyMiddleware
   */
  <MobxProvider passportStore={passportStore}>
      <BrowserRouter>
        <App store={passportStore}>
        <Route exact path={HOME_PATH} render={(props) => (<Home {...props} store={passportStore} />)} />
          <Route exact path={SIGN_UP_PATH} render={(props) => (<SignUp {...props} store={passportStore} />)}/>
          <Route exact path={SIGN_IN_PATH} render={(props) => (<SignIn {...props} store={passportStore} />)}/>
          <Route exact path={DASHBOARD_PATH} render={(props) => (<AuthGuard {...props} store={passportStore}><Dashboard {...props} store={passportStore} /></AuthGuard>)} />
        </App>
      </BrowserRouter>
  </MobxProvider>,
  document.querySelector('#oauth_root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// serviceWorker.register();
