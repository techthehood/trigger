import /*React,*/ {useEffect} from 'react';
import Header from "./Header";
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { HOME_PATH, CHAT_PATH, SIGN_UP_PATH, SIGN_IN_PATH, DASHBOARD_PATH } from '../paths/';

/**
 * @module OAClient-App
 * @category Auth
 * @subcategory client
 * @desc root for oauth_client app
 * found in src/js/components/app.js
 * @see [../index.js (linkback)]{@link module:OAClient-index}
 * @return {void}
 */

/**
 * @file
 */


export default (props) => {

  const {pathname} = useLocation();
  
  // if auth remove boilerplate
  let test_path = CHAT_PATH.replace(/\//ig, "");// this should work even if homepath is "/";
  let path_remainder = pathname.split(`${test_path}/`)[1];// this will calculate trailing paths
  // console.log(`[App] history`, location);
  
  // useEffect(() => {
  //   let root = document.querySelector('#oauth_root');
  //   if (!path_remainder || path_remainder == ""){
  //     root.classList.add("full");
  //   }else{
  //     root.classList.remove("full");
  //   }
  // })

  // NOTE: i had to use App to initialize my react-hook-form because it could only be used in a functional component
  const { register, getValues, setValue, handleSubmit, watch, errors, formState, setError, clearError, triggerValidation } = useForm({ mode: "onchange", criteriaMode: "all" });
  const form_data = { register, getValues, handleSubmit, setValue, errors, formState, setError, clearError, triggerValidation };
  props.store.form_data = form_data;

  // console.log(`[App] path_remainder`, path_remainder);
  console.log(`[App] device id`, MediaDeviceInfo.deviceId);

  return (
    !path_remainder || path_remainder == "" ?
    <>{ props.children }</>
     : 
     <div>
      <Header {...props}/>
      <div className="container">
        {props.children}
      </div>
    </div>
  )
}
