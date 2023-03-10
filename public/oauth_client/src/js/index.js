// import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route} from 'react-router-dom';

// import { createStore, applyMiddleware } from 'redux';
// import { Provider } from 'react-redux';
// import { Provider as MobxProvider } from 'mobx-react';
// import reduxThunk from 'redux-thunk';
import axios from 'axios';

import { PassportProvider } from './passportContext';
import { TriggerProvider } from './triggerContext';


const passportStore = require('./passportStore').default;
const triggerStore = require('./triggerStore').default;


// import * as serviceWorker from './serviceWorker';

import App from "./components/App";
import Home from "./components/Home";
import Client from "./components/Client";
import Chat from "./components/Chat";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import AuthGuard from "./components/HOCs/authGuard";
import Dashboard from "./components/Dashboard";
import ErrorBoundary from './components/Error';
// import reducers from "./reducers/";
require("./components/components.scss");
require("../css/icons.scss");
require("../css/d3po.scss");
require("../css/style.scss"); 
require("../../../icomoon/d3po.scss");


import { HOME_PATH, CHAT_PATH, CLIENT_PATH, SIGN_UP_PATH, SIGN_IN_PATH, DASHBOARD_PATH } from './paths/'

const jwtToken = localStorage.getItem('JWT_TOKEN');

// i changed some values on the fake_token and ist still came out valide???


console.log("[jwtToken]", jwtToken);
axios.defaults.headers.common['Authorization'] = jwtToken;

console.log(`[trigger] index.js`,CHAT_PATH);

var urlMod = "validateToken";
const ctrl_Url = `${location.origin}/api/trigger/users/${urlMod}`;
const {exists, obj_exists} = require('./tools/exists');

Promise.resolve()
.then(async (params) => {

  console.log(`[trigger][index.js] pre axios request`);

  const result = await axios.get(ctrl_Url);
  
  // DOCS: find the users data in the result.data.user object - has sponsor_id and image
  // if client_id exists it will be there if not it will show only sponsor_id
  console.log(`[trigger][index.js] validate token`, result);

  passportStore.setAuth({ token: jwtToken, auth: true });

  let user = obj_exists(result, "data.user") ? result.data.user : undefined;
  if(user){
    if (obj_exists(user,"sponsor.sponsor_id")){ 
      // let prep_sponsor = {
      //   sponsor_id: user.sponsor.sponsor_id,
      //   image: user.sponsor.image,
      //   default_image: user.sponsor.default_image
      // }

      // if (user.sponsor.username) prep_sponsor.username = user.sponsor.username;
      // triggerStore.setSponsor({ ...prep_sponsor});
      triggerStore.setSponsor({ ...user.sponsor });
    }
    if(obj_exists(user,"client.client_id")) triggerStore.setClient(user.client.client_id);
  }// if

}).catch((err) => {
  console.log(err);
  // if this fails - goto home
  passportStore.setAuth({token:jwtToken, auth: false});

  // if im here there was a 401 unauthorized status
}).finally(() => {
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
    <ErrorBoundary>
    <PassportProvider store={passportStore}>
      <TriggerProvider store={triggerStore}>
        <Router>
          <App store={passportStore}>
            <Route exact path={CHAT_PATH} render={(props) => (<AuthGuard {...props} store={passportStore}><Chat {...props} store={passportStore} /></AuthGuard>)} />
            {/* <Route path={['/client/:title', CLIENT_PATH]} render={(props) => (<Client {...props} store={passportStore} />)} /> */}
            <Route path={CLIENT_PATH} render={(props) => (<Client {...props} store={passportStore} />)} />
            <Route exact path={HOME_PATH} render={(props) => (<Home {...props} store={passportStore} />)} />
            <Route exact path={SIGN_UP_PATH} render={(props) => (<SignUp {...props} store={passportStore} />)} />
            <Route exact path={SIGN_IN_PATH} render={(props) => (<SignIn {...props} store={passportStore} />)} />
            <Route exact path={DASHBOARD_PATH} render={(props) => (<AuthGuard {...props} store={passportStore}><Dashboard {...props} store={passportStore} /></AuthGuard>)} />
          </App>
        </Router>
      </TriggerProvider>
    </PassportProvider>
    </ErrorBoundary>,
    document.querySelector('#oauth_root'));
})
/**  
 * GOTCHA: Route render props are limited to route, location, and history - all other props are added to 
 * passportStore though the App component
 * [Route props](https://reactrouter.com/web/api/Route/route-render-methods)
*/





// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
// serviceWorker.register();

// import {PassportProvider} from './passportContext';
// import { TriggerProvider } from './triggerContext';
{/* <PassportProvider store={passportStore}>
  <TriggerProvider store={triggerStore}>

  </TriggerProvider>
</PassportProvider>, */}