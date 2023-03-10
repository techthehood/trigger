

import /*React,*/ {useState, useEffect, useRef} from 'react';
import axios from 'axios';
import ReactDOM from 'react-dom';
const QRCode = require('qrcode.react');
import Loader from '../Loader';
import { obj_exists } from '../../tools/exists';
const { toaster } = require('../Toast/toaster.js');

const QRC = ({
  data,
  // init_callback
}) => {

  // DOCS: autorun is required - change this

  const data_key_array = Object.keys(data);
  const multi_keys = data_key_array.length > 1 ? true : false;
  const iUN_ref = useRef(Math.round(Math.random() * 10000));
  let iUN = iUN_ref.current;

  const get_home = (obj) => {
    let keys = Object.keys(obj);
    let home = keys[0];
    keys.forEach((key) => {
      if( obj_exists(obj,`${key}.home`) && obj[key].home == true){
        home = key;
      }
    });

    return home;
  }

  const [mode, setMode] = useState(get_home(data));
  const [url, setQURL] = useState();
  const tARef = useRef();


  useEffect(() => {
    // getRegistration();
    // if(init_callback) init_callback();
    if (obj_exists(data, `${mode}.autorun`) && data[mode].autorun == true){
      // setQURL(data[mode].url);// NOTE: since this only runs once it doesn't break the rule of hooks
      if (obj_exists(data, `${mode}.callback`)) {
        data[mode].callback({ setQURL });// i could send props if needed
      } else if (obj_exists(data, `${mode}.url`)) {
        setQURL(data[mode].url);
      }
    }
  },[]);


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
        url: url
      })
        .then(() => console.log('Successful share'))
        .catch((error) => console.log('Error sharing', error));
    }// if
  }// share_me

  let qr_code_ctrl_btns = multi_keys ? data_key_array.map((entry, ndx) => {
    return (
      <div className={`qr_sponsor_btn qr_btn qr_sponsor w3-btn ${mode == entry ? "active" : ""}`}
        key={`qr_btn_${ndx}_${iUN}`}
        title={obj_exists(data, `${entry}.btn_title`) ? data[entry].btn_title : data[entry].title }
        onClick={() => {
          setMode(entry);
          // setQURL();
          if(obj_exists(data,`${entry}.callback`)){
            data[entry].callback({setQURL});// i could send props if needed
          } else if (obj_exists(data, `${entry}.url`)){
            setQURL(data[entry].url);
          }
        }} >
        <div className={`pp_panelBtn pp_btn svg-icon-contact`}></div>
        {data[entry].label}
      </div>
    );// return
  }) : null;

  let qr_code_ctrls = multi_keys ? (
    <div className={`qr_code_ctrls`}>
      {qr_code_ctrl_btns}
    </div>
  ) : null;
  
  
  return (
    <div className="qr_code_wrapper">
      <div className="qr_title_cont">
        <label htmlFor="">{data[mode].title}</label>
        <p>{data[mode].description}</p>
      </div>
      {url ? <QRCode size={150} value={url} /> : <Loader name={"qr_load"} type={"dots"}/>}
      <hr />
      {qr_code_ctrls}
      <div className={`qr_text_url_cont`}>
        <textarea ref={tARef} className={`qr_text_url hide-scroll`} readOnly defaultValue={url}
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
        { navigator.share ? (
        <div className={`qr_share pp_panelBtn pp_btn svg-icon-share`}
        onClick={share_me}></div>
        ) : null}
      </div>
    </div>
  )
}

export default QRC;
