import /*React,*/ { Component, useEffect, Fragment } from "react";
import { observer, inject } from "mobx-react";

import axios from "axios";
require('./Profile.scss');

// console.log("[Profile]");

// class Profile extends React.Component{
const Profile = inject('ProfileStore')(observer(
  (props) => {

    const get_user_doc = async () => {
      var urlMod = "getUserDoc";
      let site_origin = location.origin;//nginx fix


      // var ctrl_Url = "index.php?option=com_arc&task=" + urlMod + "&format=raw&" + form_token + "=1";//this works
      // var ctrl_Url = `${site_origin}/index.php?option=com_arc&task=${urlMod}&format=raw&${form_token}=1`;//this works
      const ctrl_Url = `${location.origin}/api/profile/${urlMod}`;

      try {

        const result = await axios.get(ctrl_Url);
        // console.log("[Profile] user docs",result);

      } catch (e) {
        console.error("[Profile] user docs an error has occured", e);
      }//catch

    }// get_user_doc

    useEffect(() => {
      // console.log("[Profile] initiated", props);

      get_user_doc();

    },[])// run useEffect once with []

    let ProfileStore = props.ProfileStore;

  return (
    <Fragment>
    <h1>Hi im profile</h1>
    <h2>{ProfileStore.filter}</h2>
    </Fragment>
  );
}
));// Profile

export default Profile;
