import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
// import { connect } from 'react-redux';
import { observer, inject } from "mobx-react";

// import * as actions from '../actions/';
import { CHAT_PATH, SIGN_UP_PATH, SIGN_IN_PATH, DASHBOARD_PATH } from '../paths/';
// [Bootstrap navbar](https://getbootstrap.com/docs/4.0/components/navbar/)   

// export default class Header extends Component {
@observer
class Header extends Component {

  constructor(props){
    super(props);
    this.signOut = this.signOut.bind(this);
    this.passportStore = this.props.store;
  }// constructor

  async signOut(){
    console.log('signOut got called!');
    await this.props.signOut();

    if(!this.passportStore.state.errorMessage){
      console.log("headed home");
      //dashboard redirect
      this.props.history.push(CHAT_PATH);

      //[wrapped in withRouter to get this history. push to work](https://stackoverflow.com/questions/44009618/uncaught-typeerror-cannot-read-property-push-of-undefined-react-router-dom)
    }// if

  }// constructor

  render(){
    console.log("props",this.props);
    return (

        <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ marginBottom: "30px" }}>
          <Link className="navbar-brand" to={CHAT_PATH}>Triggered</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            { this.passportStore.state.isAuthenticated ?
              <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link className="nav-link" to={DASHBOARD_PATH}>Dashboard</Link>
                </li>
              </ul>
            : null
            }

            <ul className="nav navbar-nav ml-auto">

            { !this.passportStore.state.isAuthenticated ?
              [ <li className="nav-item" key="signup">
              <Link className="nav-link" to={SIGN_UP_PATH} >Sign Up</Link>
              </li>,
              <li className="nav-item" key="signin">
              {/*the case in the to="" dictates the case (lower or upper) of the displayed url route*/}
              <Link className="nav-link" to={SIGN_IN_PATH} >Sign In</Link>
              </li>]
              :  null }

              { this.passportStore.state.isAuthenticated ?
                <li className="nav-item">
                <Link className="nav-link" to={CHAT_PATH} onClick={this.signOut}>Sign Out</Link>
                </li> : null }
            </ul>
          </div>
        </nav>

    )
  }//render
}//Header


export default Header;
