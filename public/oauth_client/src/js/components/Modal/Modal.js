import ReactDOM from "react-dom";// it seems to already have the reference - but not everywhere (storybook)
import React, { useRef } from "react";
// console.log("[modal]");
require("./modal.scss");
const {class_maker} = require('../../tools/class_maker');
// const {demo} = require('../../tools/demo');

/**
 * @module Modal
 * @file
 * @category Display
 * @subcategory modal
 * @param  {object} props [description]
 * @return {component}       [description]
 */

  /**
   * @member README
   * @desc
   * #### How can i remove the modal window? add {no_modal: true} to props.data object
   */

const modal = (props) => {

  const my_modal = useRef();
  let s = props.data ? props.data : props;
  let name = s.name || "";
  let prefix = (typeof s.prefix != "undefined") ? s.prefix.replace("_","") : "";
  let tag = s.tag || "";// can be used as an all element class entry
  let value = (s.value) ? unescape(s.value) : (props.children) ? props.children : "";
  let iUN = s.iUN || Math.round(Math.random() * 10000);
  let w3Modal = (exists(s.no_modal) && s.no_modal) ? "" : (s.alt_modal) ? "d3-modal" : "w3-modal";
  let w3Card = (exists(s.card) && s.card) ? "w3-card" : "";
  let inline = (s.inline) ? "inline" : "";

  let modal_footer = s.footer || null;

  // ${class_maker({prefix, name, main: "modal_cont", iUN})}
  let visible = (typeof s.visible != "undefined" && s.visible == false) ? "" : "block";//force visibility - visible by default
  let show_close_btn = true;
  let show_go_btn = false;
  let show_hide_btn = false;
  let show_top_go_btn = false;
  let show_cancel_btn = false;
  let wrapper_addClass = (exists(s.wrapper) && exists(s.wrapper.addClass)) ? s.wrapper.addClass : "";
  let wrapper_class = {className: `${class_maker({prefix, name, main: "modal_cont", iUN/*, no_main: true*/})} ${tag} ${w3Modal} ${inline} ${wrapper_addClass} ${visible} core_modal`};
  let wrapper_attributes = (exists(s.wrapper) && exists(s.wrapper.attributes) ) ? s.wrapper.attributes : {};
  let wrapper_style = {};
  let wrapper_txt = "";
  let modal_addClass = (exists(s.modal) && exists(s.modal.addClass)) ? s.modal.addClass : "";
  let modal_class = {className: `${class_maker({prefix, name, main: "modal", iUN, no_main: true})} glassHouse ${tag} ${w3Card} ${modal_addClass}`};
  let modal_attributes = (exists(s.modal) && exists(s.modal.attributes) ) ? s.modal.attributes : {};
  let modal_style = {};
  let modal_txt = "";
  let content_addClass = (s.content != undefined && s.content.addClass != undefined) ? s.content.addClass : "";
  let content_class = {className: `${class_maker({prefix, name, main: "content", iUN})} glass_content ${tag} ${content_addClass}`};
  let content_attributes = (exists(s.content) && exists(s.content.attributes) ) ? s.content.attributes : {};
  let close_addClass = (s.close != undefined && s.close.addClass != undefined) ? s.close.addClass : "";
  let close_icon = (s.close != undefined && s.close.icon != undefined) ? s.close.icon : "cross";
  let close_class = {className: `${class_maker({prefix, name, main: "closeBtn", iUN})} looking_glass d3-ico d3-bg d3-disc-outer d3-disc-bg d3-abs icon-${close_icon} ${tag} ${close_addClass}`};
  let close_attributes = (exists(s.close) && exists(s.close.attributes) ) ? s.close.attributes : {};
  let close_title = {};
  let close_event_obj = {};
  let close_close;
  let close_mode = "remove";
  let hide_addClass = (s.hide != undefined && s.hide.addClass != undefined) ? s.hide.addClass : "";
  let hide_icon = (s.hide != undefined && s.hide.icon != undefined) ? s.hide.icon : "minus";
  let hide_class = {className: `${class_maker({prefix, name, main: "hideBtn", iUN})} looking_glass d3-ico d3-bg d3-disc-outer d3-disc-bg d3-abs icon-${hide_icon} ${tag} ${hide_addClass}`};
  let hide_attributes = (exists(s.hide) && exists(s.hide.attributes) ) ? s.hide.attributes : {};
  let hide_title = {};
  let hide_event_obj = {};
  let ctrls_addClass = (s.ctrls != undefined && s.ctrls.addClass != undefined) ? s.ctrls.addClass : "";
  let ctrls_attributes = (exists(s.ctrls) && exists(s.ctrls.attributes) ) ? s.ctrls.attributes : {};
  let ctrls_class = {className: `${class_maker({prefix, name, main: "ctrls_wrapper", iUN})} modal_ctrls_wrapper  ${tag} ${ctrls_addClass}`};
  let go_event_obj = {};
  let go_addClass = (s.go != undefined && s.go.addClass != undefined) ? s.go.addClass : "";
  let go_attributes = (exists(s.go) && exists(s.go.attributes) ) ? s.go.attributes : {};
  let go_class = {className: `${class_maker({prefix, name, main: "goBtn", iUN})} modal_ctrls glass_confirm ${tag} d3-ico-full d3-disc-bg icon-checkmark ${go_addClass}`};
  let go_title = {};
  let top_go_class = {className: `${class_maker({prefix, name, main: "topGoBtn", iUN})} ${tag} glass_confirm d3-ico d3-bg d3-disc-outer d3-disc-bg d3-abs icon-checkmark ${go_addClass}`};
  let cancel_addClass = (s.cancel != undefined && s.cancel.addClass != undefined) ? s.cancel.addClass : "";
  let cancel_icon = (s.cancel != undefined && s.cancel.icon) ? "d3-ico-full d3-disc-bg icon-cross" : "";
  let cancel_class = {className: `${class_maker({prefix, name, main: "cancelBtn", iUN})} modal_ctrls arc_can_btn ui-btn ${tag} ${cancel_icon} ${cancel_addClass}`};
  let cancel_attributes = (exists(s.cancel) && exists(s.cancel.attributes) ) ? s.cancel.attributes : {};
  let cancel_title = {};
  let cancel_event_obj = {};
  let cancel_txt = "";
  let cancel_close;
  let hasWrapper = (typeof s.hasWrapper != "undefined") ? true : false;

    // s.custom
    if(s.modal){
      let modal_obj = s.modal;
      modal_style = s.modal.style ? {style: s.modal.style} : {};

      if(modal_obj.className){
        modal_class = {className: modal_obj.className}
      }

      modal_txt = (modal_obj.txt) ? modal_obj.txt : "";
    }// if modal


    let hide_me = (mode = close_mode) => {
      // console.log("[hide me]",this);
      // let my_src = e.target;
      // // use a css grid format to reduce containers/dom elements
      // let target_parent = my_src.parentNode;
      let target_parent = my_modal.current;
      let target_container = target_parent.parentNode.parentNode;

      if(mode == "hide"){
        // remove css style

      }else{
        // remove element
        // target_container.removeChild(target_parent);
        // target_container.classList.remove("block","w3-modal");
        ReactDOM.unmountComponentAtNode(target_container);// this is like innerHTML = "" for react components
        if(hasWrapper == true){
          // then remove the parent element
          let bigDaddy = target_container.parentNode;
          bigDaddy.removeChild(target_container);
        }// if
      }//else
    }


    // this is temporaray - you can delete this afterwhile
    // let hide_me2 = (e) => {
    //   // console.log("[hide me]",this);
    //   // let my_src = e.target;
    //   // // use a css grid format to reduce containers/dom elements
    //   // let target_parent = my_src.parentNode;
    //   let target_parent = my_modal.current;
    //   let target_container = target_parent.parentNode.parentNode;
    //
    //   if(close_mode == "hide"){
    //     // remove css style
    //   }else{
    //     // remove element
    //     // target_container.removeChild(target_parent);
    //     // target_container.classList.remove("block","w3-modal");
    //     if(!hasWrapper){
    //     ReactDOM.unmountComponentAtNode(target_container);// this is like innerHTML = "" for react components
    //   }
    //     if(hasWrapper == true){
    //       // then remove the parent element
    //       let bigDaddy = target_container.parentNode;
    //       ReactDOM.unmountComponentAtNode(bigDaddy);
    //       // bigDaddy.removeChild(target_container);
    //     }// if
    //   }//else
    // }

    if(s.close){
      // LATER: close and cancel should be the exact same except for their displays
      let close_obj = s.close;
      show_close_btn = (typeof s.close.show != undefined) ? s.close.show : true;
      close_mode = (exists(s.close.hide) && s.close.hide == true) ? "hide" : "remove";

      if(close_obj.className){
        close_class = {className: close_obj.className}
      }

      close_title = (close_obj.title) ? {title: close_obj.title} : {};

      if(close_obj.callback){
        close_event_obj.onClick = (e) => {
          e.preventDefault();
          // demo(e.target, () => {
          //   close_obj.callback(e, {modal: my_modal, close: hide_me}, close_obj.data);
          // });
          close_obj.callback(e, { modal: my_modal, close: hide_me }, close_obj.data);
        }
      }else {
        close_event_obj.onClick = (e) => {
          e.preventDefault();
          // demo(e.target, () => {
          //   hide_me();
          // });

          hide_me();
        };
      }

    }// if close

    if(s.hide){
      // LATER: hide and cancel should be the exact same except for their displays
      let hide_obj = s.hide;
      show_hide_btn = (typeof s.hide.show != undefined) ? s.hide.show : true;

      if(hide_obj.className){
        hide_class = {className: hide_obj.className}
      }

      hide_title = (hide_obj.title) ? {title: hide_obj.title} : {};

      if(hide_obj.callback){
        hide_event_obj.onClick = (e) => {
          e.preventDefault();
          // demo(e.target, () => {
          //   hide_obj.callback(e, {modal: my_modal, close: hide_me}, hide_obj.data);
          // });
          hide_obj.callback(e, { modal: my_modal, close: hide_me }, hide_obj.data);
        }
      }else {
        hide_event_obj.onClick = (e) => {
          e.preventDefault();
          // demo(e.target, () => {
          //   hide_me();
          // });
          hide_me();
        };
      }

    }// if hide

    if(s.content){

      let content_obj = s.content;

      if(content_obj.className){
        content_class = {className: content_obj.className}
      }// if

    }// if content

    let go_obj = s.go;// it only comes in here if one of these exists

    // if there is a go property
  if(go_obj){

    show_go_btn = go_obj.show || true;
    show_top_go_btn = go_obj.top || false;
    // LATER: add an upper go btn if it doesn't exist - && green both

    if(go_obj.className){
      go_class = {className: go_obj.className};
    }//

    // go button click event callback
    go_event_obj.onClick = (e) => {
      e.preventDefault();
      e.persist();
      // demo(e.target, () => {
      //   go_obj.callback(e, {modal: my_modal, close: hide_me}, go_obj.data);
      // });
      go_obj.callback(e, { modal: my_modal, close: hide_me }, go_obj.data);
    }// go_event_obj

    go_title = (go_obj.title) ? {title: go_obj.title} : {};

  }// if

  if(s.cancel){
    let cancel_obj = s.cancel;
    show_cancel_btn = s.cancel.show || true;
    close_mode = (exists(s.cancel.hide) && s.cancel.hide == true) ? "hide" : "remove";

    if(cancel_obj.className){
      cancel_class = {className: cancel_obj.className}
    }

    cancel_txt = (cancel_obj.txt) ? cancel_obj.txt : "";
    cancel_title = (cancel_obj.title) ? {title: cancel_obj.title} : {};

    if(cancel_obj.callback){
      cancel_event_obj.onClick = (e) => {
        e.preventDefault();
        // demo(e.target, () => {
        //   cancel_obj.callback(e, {modal: my_modal, close: hide_me}, cancel_obj.data);
        // });
        cancel_obj.callback(e, { modal: my_modal, close: hide_me }, cancel_obj.data);
      }
    }else {
      cancel_event_obj.onClick = (e) => {
        e.preventDefault();
        // demo(e.target, () => {
        //   hide_me();
        // });
        hide_me();
      };
    }
  }// if cancel

  if(exists(s.ref)){
    s.ref.current = {modal: my_modal, close: hide_me};
  }

  let close_btn = (show_close_btn == true) ? (<div {...close_class} {...close_event_obj} {...close_title} {...close_attributes} ></div>) : null;
  let hide_btn = (show_hide_btn == true) ? (<div {...hide_class} {...hide_event_obj} {...hide_title} {...hide_attributes} ></div>) : null;
  let top_go_btn = (show_top_go_btn) ? (<div {...top_go_class} {...go_event_obj} {...go_title} {...go_attributes} ></div>) : null;
  let modal_content = (
    <div {...content_class} {...content_attributes} >
    {value}
    </div>
  );

  let go_btn = (show_go_btn) ? (<div {...go_class} {...go_event_obj} {...go_title} {...go_attributes} ></div>) : null;
  let cancel_btn = (show_cancel_btn) ? (<div {...cancel_class} {...cancel_event_obj} {...cancel_title} {...cancel_attributes} >{cancel_txt}</div>) : null;
  // LATER: modify ITKR modal to match this one (with cancel_event_obj && close_event_obj instead of hide_me)


  const ret_El = (
    <div {...wrapper_class} {...wrapper_style} {...wrapper_attributes} data-comp={`Modal`} >
      <div {...modal_class} {...modal_style} ref={my_modal} {...modal_attributes}>
        {hide_btn}
        {close_btn}
        {top_go_btn}
        {modal_content}
        { show_go_btn || show_cancel_btn ? (
          <div {...ctrls_class} {...ctrls_attributes}>
            {go_btn}
            {cancel_btn}
          </div>
        ) : null}
        {modal_footer}
      </div>
    </div>
  );

  return ret_El;
}

export default modal;

const exists = (item, notEmpty) => {
  let exists = (item != null && typeof item != "undefined" && item != false) ? true : false;

  if(notEmpty){
    return (exists && item != "") ? true : false;
  }else {
    return exists;
  }
}// exists
