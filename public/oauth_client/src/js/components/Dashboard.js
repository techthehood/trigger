  import /*React,*/ {Component} from 'react';
  import {Link, withRouter} from 'react-router-dom';
  // import { connect } from 'react-redux';
  import { observer, inject } from "mobx-react";

  // import * as actions from '../actions';
  import { CHAT_PATH } from '../paths/';

  @observer
  class Dashboard extends Component {

    constructor(props){
      super(props);
      this.passportStore = this.props.store;
    }

    async componentDidMount(){
      await this.passportStore.getSecret();
    }

    signOut = async () => {
      console.log('signOut got called!');
      // await this.props.signOut();
      await this.passportStore.signOut();

      if (!this.passportStore.state.errorMessage) {
        console.log("headed home");
        //dashboard redirect
        this.props.history.push(CHAT_PATH);
        //[wrapped in withRouter to get this history. push to work](https://stackoverflow.com/questions/44009618/uncaught-typeerror-cannot-read-property-push-of-undefined-react-router-dom)
      }// if

    }// signOut

    render(){
      return (
        <div className="home_auth_cont">
          This is a Dashboard
          <br />
          Our secret: <h3>{this.passportStore.state.secret}</h3>
          <div className="signing_btn_wrapper">
            <div className="sign-btn" key="signout">
              <Link className="nav-link" to={CHAT_PATH} onClick={this.signOut} >Sign Out</Link>
            </div>
          </div>
        </div>
      )
    }
}// Dashboard

  export default Dashboard; 
