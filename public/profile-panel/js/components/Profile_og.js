import React, { Component } from "react";
// import {reduxForm, Field} from 'redux-form'
import { connect } from 'react-redux';
// import { compose } from 'redux';

import * as actions from '../actions';

console.log("[Profile]");

// class Profile extends React.Component{
class Profile extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return (
      <React.Fragment>
      <h1>Hi im profile</h1>
      <h2>{this.props.auth.text}</h2>
      </React.Fragment>
    );
  }
}// class Profile

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  }
}

// export default Profile;
// export default ReactRedux.connect( mapStateToProps, actions)(Profile);
export default connect( mapStateToProps, actions)(Profile);
