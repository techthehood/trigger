

import /*React,*/ { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
const QRCode = require('qrcode.react');
import Loader from '../Loader';
const { toaster } = require('../Toast/toaster.js');


const QRC = ({

}) => {

  const [mode, setMode] = useState("register");
  const [qURL, setQURL] = useState();
  const tARef = useRef();

  useEffect(() => {
    getRegistration();
  }, []);

  const getRegistration = async () => {
    try {
      const urlMod = "getGuestToken";
      const ctrl_Url = `${location.origin}/api/trigger/users/${urlMod}`;
      const result = await axios.get(ctrl_Url);
      console.log(`[QRC] get registration token`, result);

      let token = result.data.token;

      setQURL(`${location.origin}/client/${token}`);
    } catch (error) {
      console.error(`[QRC][getRegistration] an error occured`, error);
      let qrc_error_msg = "an error occured";
      toaster({ mode: "show", name: "qrc_err", custom: "danger", message: qrc_error_msg, auto: true, sec: 5 });
    }
  }// getRegistration

  const copy_me = async () => {
    try {

      console.log("[copy me] clicked");
      // let el = document.querySelector(`.${id}`);
      let el = tARef.current;
      console.log(`[textarea] focused`);
      el.select();
      document.execCommand('copy');
    } catch (error) {
      throw "[QRC][copy_me] An error occured";
    }
  }// copy_me

  const share_me = () => {

    // let alias = dObj.alias,
    //   tool = dObj.tool,
    //   pages = dObj.pages,
    //   s = this.props.data,
    //   name = s.name,
    //   iUN = (s.iUN) ? s.iUN : this.state.iUN,
    //   mode = s.mode || "share",
    //   detail_url = (exists(dObj.url)) ? dObj.url : this.genUrl({ tool, alias, pages });

    // let x_test1 = exists("");// false
    // let x_test2 = exists("words");// true
    // let x_test3 = exists("",true);// true
    // let x_test4 = exists("words",true);// true

    // if copy mode skip this
    if (navigator.share) {

      // let category = dObj.category,
      //   description = dObj.description,
      //   title = dObj.title;
      // also a dObj.description - may be available run an if(!= "")

      navigator.share({
        // title: unescape(this.htmlDecode(category)),
        // text: unescape(this.htmlDecode(title)),
        /*url: url*/
        url: qURL
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }// if
  }// share_me

  let label_text = {
    register: {
      title: "Register Client",
      description: "New clients can use this link to join the trigger family with you as their sponsor."
    },
    counselor: {
      title: "Counselor Connect",
      description: "New clients can instantly navigate to your credentials, to connect to your content or to add you as a counselor."
    }
  }

  return (
    <div className="qr_code_wrapper">
      <div className="qr_title_cont">
        <label htmlFor="">{label_text[mode].title}</label>
        <p>{label_text[mode].description}</p>
      </div>
      {qURL ? <QRCode size={150} value={qURL} /> : <Loader name={"qr_load"} type={"dots"} />}
      <hr />
      <div className={`qr_code_ctrls`}>
        <div className={`qr_sponsor_btn qr_btn qr_sponsor w3-btn ${mode == "register" ? "active" : ""}`}
          title="Sponsor a new client"
          onClick={() => {
            setMode("register");
            setQURL();
            getRegistration();
          }} >
          <div className={`pp_panelBtn pp_btn svg-icon-contact`}></div>
          Registration
        </div>
        <div className={`qr_counselor_btn qr_btn qr_counselor w3-btn ${mode != "register" ? "active" : ""}`}
          title="new Counselor Connection"
          onClick={() => {
            setMode("counselor");
            setQURL("https://github.com/zpao/qrcode.react");
          }}>
          <div className={`pp_panelBtn pp_btn svg-icon-users-add`}></div>
          Counselor
        </div>
      </div>
      <div className={`qr_text_url_cont`}>
        <textarea ref={tARef} className={`qr_text_url hide-scroll`} readOnly defaultValue={qURL}
          onFocus={(e) => {
            e.preventDefault();
            copy_me()
              .then(() => {
                let copy_msg = "copied to clipboard"
                toaster({ mode: "show", name: "qrc_copy", message: copy_msg, auto: true, sec: 5 });
              }).catch(() => {
                let copy_error_msg = "an error occured";
                toaster({ mode: "show", name: "qrc_copy", custom: "danger", message: copy_error_msg, auto: true, sec: 5 });
              });
            e.stopPropagation();
          }}></textarea>
        <div className={`qr_copy w3-btn`} onClick={(e) => {
          e.preventDefault();
          copy_me()
            .then(() => {
              let copy_msg = "copied to clipboard"
              toaster({ mode: "show", name: "qrc_copy", message: copy_msg, auto: true, sec: 5 });
            }).catch(() => {
              let copy_error_msg = "an error occured";
              toaster({ mode: "show", name: "qrc_copy", custom: "danger", message: copy_error_msg, auto: true, sec: 5 });
            });
          e.stopPropagation();
        }} >
          <div className={`pp_panelBtn pp_btn svg-icon-copy`}></div>
          Copy to clipboard
        </div>
        {navigator.share ? (
          <div className={`qr_share pp_panelBtn pp_btn svg-icon-share`}
            onClick={share_me}></div>
        ) : null}
      </div>
    </div>
  )
}

export default QRC;
