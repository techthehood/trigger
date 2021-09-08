import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link, withRouter, useParams } from 'react-router-dom';
import axios from 'axios';

import Loader from './Loader';
const { exists, obj_exists } = require('../tools/exists');

import { CHAT_PATH, CLIENT_PATH, HOME_PATH, SIGN_UP_PATH, SIGN_IN_PATH, DASHBOARD_PATH, SUCCESS_PATH } from '../paths';

const display_console = false;

const Client = (props) => {

  const passportStore = props.store;

  const [status, setStatus] = useState("pending");

  const {token} = useParams();

  const timer = useRef();

  useEffect(() => {
    register_client();
    return () => {
      clearTimeout(timer.current);
    }
  }, []);

  const slow_and_go = (loc, sec) => {

    let hold_time = (sec) ? sec * 1000 : 3000;// 1000 = 1s

    timer.current = setTimeout(() => {
      switch (loc) {
        case "chat":
          location.replace(`${location.origin}${SUCCESS_PATH}`);
          break;
      
        default:
          location.replace(`${location.origin}${HOME_PATH}`);
          break;
      }
    }, hold_time);
  }

  const register_client = () => {
    if(display_console || true) console.log("[client] token", token);
    axios.defaults.headers.common['Authorization'] = token;

    console.log(`[trigger] index.js`, CHAT_PATH);

    var urlMod = "registerClient";
    const ctrl_Url = `${location.origin}/api/trigger/users/${urlMod}`;

    Promise.resolve()
      .then(async (params) => {
        const result = await axios.get(ctrl_Url);

        // DOCS: find the users data in the result.data.user object - has sponsor_id and image
        // if client_id exists it will be there if not it will show only sponsor_id
        console.log(`[trigger][index.js] validate token`, result);
        
        if(result.data.error || !obj_exists(result,"data.token")){
          setStatus("failure");
        }else{
          setStatus("success");
          // add the token to localStorage
          localStorage.setItem('JWT_TOKEN', result.data.token);
          // set a delay and redirect
          slow_and_go('chat', 5);
        }

      }).catch((err) => {
        console.log(`[trigger][client] an error occured`,err);
        // NOTE: deep rooted errors (signToken) print in the return html <pre> tag found in err.response.data
        setStatus("failure");
        slow_and_go('home',5);
        // if im here there was a 401 unauthorized status
      })
  }

  const signOut = async () => {
    console.log('signOut got called!');
    // await props.signOut();
    await passportStore.signOut();

    if (!passportStore.state.errorMessage) {
      console.log("headed home");
      //dashboard redirect
      props.history.push(HOME_PATH);
      //[wrapped in withRouter to get this history. push to work](https://stackoverflow.com/questions/44009618/uncaught-typeerror-cannot-read-property-push-of-undefined-react-router-dom)
    }// if


  }// signOut

  return (
    <Fragment>
      <div className="home_auth_cont client_cnx_cont">
        {status == "pending" ? <Loader name={"client_cnx"} type={"dots"} /> : null}
        {status == "success" ? <div className="check-mark icon-check-mark icon_btn client_result_logo heartbeat"></div> : null}
        {status == "failure" ? <div className="nope-mark icon-nope-mark icon_btn client_result_logo ping"></div> : null}
      </div>
    </Fragment>
  )
}// Client


export default Client;
