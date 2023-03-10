import /*React,*/ { Fragment } from 'react';
import { Link, withRouter } from 'react-router-dom';

import { CHAT_PATH, HOME_PATH, SIGN_UP_PATH, SIGN_IN_PATH, DASHBOARD_PATH } from '../paths';

const Auth = (props) => {

  const passportStore = props.store;

  const signOut = async () => {
    console.log('signOut got called!');
    // await props.signOut();
    await passportStore.signOut();

    if (!passportStore.state.errorMessage) {
      console.log("headed home");
      //dashboard redirect
      // props.history.push(HOME_PATH);
      location.replace(`${location.origin}${HOME_PATH}`);// path already has leading slash
      //[wrapped in withRouter to get this history. push to work](https://stackoverflow.com/questions/44009618/uncaught-typeerror-cannot-read-property-push-of-undefined-react-router-dom)
    }// if


  }// signOut

  return (
    <Fragment>
      <div className="home_auth_cont">
        <div className="signing_btn_wrapper">
          Welcome to our home page!
          {!passportStore.isAuthenticated ?
            [<div className="sign-btn" key="signup">
              <Link className="nav-link" to={SIGN_UP_PATH} >Sign Up</Link>
            </div>,
            <div className="sign-btn" key="signin">
              <Link className="nav-link" to={SIGN_IN_PATH} >Sign In</Link>
            </div>]
            :
            (
              <div className="sign-btn" key="signout">
                <Link className="nav-link" to={HOME_PATH} onClick={signOut} >Sign Out</Link>
              </div>
            )}
        </div>
      </div>
    </Fragment>
  )
}// default


export default Auth;
