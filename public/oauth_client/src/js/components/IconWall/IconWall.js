
import /*React,*/ { useEffect, useState, useContext, Fragment, useRef, useMemo } from 'react';
import { observer, inject } from "mobx-react";
import Modal from '../Modal/Modal';
// const {icon_finder} = require('../../tools/icon_finder');
const {class_maker} = require('../../tools/class_maker');
const {exists} = require('../../tools/exists');

require("./IconWall.scss");

const IconWall = observer((props) => {

  // const data = props.data;

  const {
    show_labels = true,
    name = "iWall",
    label = "",
    prefix = "",
    default_options = ['link','folder','image','text','activity','video'],
    option_icons,
    inline = false,
    callback,
    data,
    modal,
    single_click = false,
    //mode,// single_click, multi_click, multi_update
  } = props;
  

  const [active_options, setActiveOptions] = useState(props.active_options || []);

  const has_modal = modal || false;


  const inline_cls = inline ? "inline" : "";


  const mode = (single_click) ? "single_click" : (props.mode != undefined) ?  props.mode  : "multi_click";// the other mode is multi_update

  const modal_ref = useRef();

  const iconWall_cont = useRef();
  const iconWall_cont_orient = useRef("left");

  // const form_data = props.form;

  let iUN = Math.round(Math.random() * 10000);

  const [upVal, setUpVal] = useState(0); // integer state
  const forceUpdate = () => {
    setUpVal(upVal => ++upVal); // update the state to force render
  }// forceUpdate

  useEffect(() => {
    // this will adjust the scroll action of the btns based on available btn overflow
    // may or may not need to run with each render since the btn count isn't dynamic (shouldn't change)
    // but if it was given a default value and that value changes then it will need to update
    if(iconWall_cont.current != undefined && inline) {
      // get the bounding width and the scroll width
      let last_orient = iconWall_cont_orient.current;

      let bounding = iconWall_cont.current.getBoundingClientRect();
      let scroll_width = iconWall_cont.current.scrollWidth;

      // if the scroll width exceeds the bounding width justify left, otherwise justify center
      if(scroll_width >= bounding.width){
        iconWall_cont_orient.current = "left";
      }else{

        iconWall_cont_orient.current = "center";
      }// else

      // if the orientation has changed, force render
      if(last_orient != iconWall_cont_orient.current){
        forceUpdate();
      }
    }// if
  },[upVal]);// i think i can limit this effectively by watching upVal

  useEffect(() => {
    // watch active options, if multi_update do something
    if(mode == "multi_update"){
      let obj = modal_ref.current;
      if(obj) obj.value = name;// i guess this can be used as a last clicked tracker
      // obj.close();// works
      // this takes both multiple clicks and has a callback the is passed in so
      // it runs the callback in icon_go
      icon_go("", obj);
    }
  },[active_options]);

  useEffect(() => {
    // run once if not inline
    if (!inline) {
      // get the container
      let iW_cont = iconWall_cont.current;
      // get its childnodes
      let iW_btns = iW_cont.querySelectorAll(".iconWall_btn");
      // count the btns
      let btn_count = iW_btns.length;// may need Array.from

      switch (btn_count) {
        case 1:
          console.debug(`[IconWall] btn count = `,btn_count);
            iW_cont.classList.add("single");
          break;
        case 2:
          console.debug(`[IconWall] btn count = `,btn_count);
            iW_cont.classList.add("double");
          break;
        default:

      }
    }// if

  },[]);

  
  const icon_finder = (val) => {
    return val;
  }// icon_finder

  const set_data_types = (e, name, type, ndx) => {
    switch (mode) {
      case "single_click":
        // can single click be used without the modal? if so add a generic obj instead of modal_ref
        // in this usecase there is nothing to close
        let obj = modal_ref.current || {};
        obj.value = name;
        obj.type = type;
        obj.ndx = ndx;
        setActiveOptions([name]);
        // obj.close();// works
        icon_go(e, obj);
        break;

      default:
        let temp_icons;
        if(active_options.includes(name)){
          // remove it
          temp_icons = active_options.filter((item) => {
            return item != name;
          });

          setActiveOptions([...temp_icons]);
        }else{
          // add it
          let temp_icons = [...active_options];
          temp_icons.push(name);
          setActiveOptions([...temp_icons]);
        }

        // forceUpdate();
    }// switch
  }// set_data_types

  const icon_go = (e, obj = {}) => {

    if(callback){
      // add btn data to the obj
      // obj.test_data = "testing...testing.";
      obj.active_options = active_options;

      if(data){
        obj.data = data;
      }// if

      callback(e,obj);
      // i should also be able to do a multi_click_update where i can choose not to close it
      // but each click brings a new array of active values
    }else{
      // it should never run this in production (just 4 testing)
      obj.close();
    }
  }// icon_go

  // const close_panel = (e,obj) => {
  //
  // 		obj.close();
  //
  // }


  // let iconWall_btns = useMemo(()=>{
  //
  //     return default_options.map((type, ndx, ary) => {
    let iconWall_btns = default_options.map((type, ndx, ary) => {

      let prefix_str = `${prefix}_iconWall_btn`;
      let btn_id = `${name}_${iUN}_${ndx}`;
      let text, icon, add_active, btn_label = false;

      if(typeof type != "string"){
        // for object oriented btn data
        text = type.text;
        icon = type.icon ? type.icon : icon_finder(text);
        add_active = (active_options.includes(text)) ? "active" : "";
        btn_label = type.label ? type.label : false;
      }else{
        text = type;
        icon = (Array.isArray(option_icons)) ? option_icons[ndx] : icon_finder(text);
        add_active = (active_options.includes(text)) ? "active" : "";
      }
      return(
        <div key={`${btn_id}`}>
          <div className={`${btn_id} ${name} ${text} ${prefix_str} ${name}_iconWall_btn iconWall_btn IconWall icon-${icon} ${add_active}`}
            title={btn_label ? btn_label : text}
            data-type={text}
            onClick={(e) => {
              e.preventDefault();
              e.persist();
              set_data_types(e, text, type, ndx);
            }}
          ></div>
          {show_labels && btn_label ? <label className={`label ${btn_id} ${name} ${text} ${prefix}_iconWall_label iconWall_label`}>{btn_label}</label> : null}
        </div>
      )
    });
  // },[default_options]);

  let title_el = (exists(label)) ? (
    <div className="iconwall_title" title={label.description}>{label.text}</div>
  ) : null;

  let icon_wall_elements;

  if (has_modal) {

    let modal_data = {
      name,
      tag: "core",
      ref: modal_ref,
      hasWrapper: true,
      // wrapper: {
      //   style:{
      //     zIndex: modal_z
      //   }
      // },
      content:{
        addClass:"hide-scroll data_type" /*data_type added here helps modify the content border (glass_content)*/
      },
      close:{
        show: true,
        // hide: true,
        // callback: close_panel
      }
    }// modal_data

    if(!single_click){
      modal_data.go = {
      	show: true,
      	callback: icon_go
      };
      modal_data.cancel = {
        show: true,
        // hide: true,
        // callback: close_panel
      }
    }// if single_click

    if (inline) {
      modal_data.no_modal = true;
      modal_data.inline = true;
      delete modal_data.go;
      delete modal_data.cancel;
      modal_data.close.show = false;
    }// if inline

    icon_wall_elements = (
      <Modal data={modal_data} >
        <div className={`${class_maker({prefix,name,main:"iconWall_wrapper",iUN})} ${inline_cls} hide-scroll`} >
          {title_el}
          <div className={`${class_maker({prefix,name,main:"iconWall_cont",iUN})} ${inline ? iconWall_cont_orient.current : ""}`}
            ref={iconWall_cont}>
            {iconWall_btns}
          </div>
        </div>
      </Modal>
    );

  } else {
    icon_wall_elements = (
      <div className={`${class_maker({ prefix, name, main: "iconWall_wrapper", iUN })} ${inline_cls} hide-scroll`} 
      data-comp={`IconWall`} >
        <div className={`${class_maker({prefix,name,main:"iconWall_cont",iUN})} ${inline ? iconWall_cont_orient.current : ""}`}
          ref={iconWall_cont}>
          {iconWall_btns}
        </div>
      </div>
    )
  }

  return (
    icon_wall_elements
  );
})// observer

export default React.memo(IconWall);
