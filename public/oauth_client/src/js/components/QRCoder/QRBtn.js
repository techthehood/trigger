import /*React,*/ { useContext } from 'react'
import ReactDOM from 'react-dom';
import { observer, inject } from "mobx-react";

const { wrapr } = require('../../tools/wrapr');
import Modal from '../Modal';
import QRC from './QRC';
require('./QRCoder.scss');

const QRBtn = observer(({
  icon,// = `svg-icon-${icon}`,
  name = "",
  project = "",
  uuid = "",
  autorun = true,
  data,
}) => {
  
  // const upload_form = (e, obj) => {

  //   // close the modal
  //   uploadForm({ state, form: { getValues }, store: FormStore }, "").then(() => {
  //     FormStore.reset();
  //     obj.close();
  //   })

  // }// upload_form

  const close_panel = (e, obj) => {
    // close the modal
    obj.close();
  }// close_panel

  const start_modal = (params) => {

    let qrc_modal_cont = wrapr({ name: "qrc_modal_cont", home: ".modal_home", custom: "w3-part block" });

    let item = triggerStore.sponsor;
    item.id = item.sponsor_id;

    let modal_data = {
      name: "qrc_view",
      tag: "",
      hasWrapper: true,
      // wrapper: {
      //   style:{
      //     zIndex: modal_z
      //   },
      // addClass: "some-class"
      // },
      modal: {
        addClass: "QRCBtn"
      },
      content: {
        addClass: "hide-scroll"
      },
      // go:{
      // 	show: true,
      // 	callback: close_panel
      // },
      close: {
        show: true,
        //addClass:"pp_btn svg-icon-cross",
        // hide: modal_close_hide,// deprecated
        // hide: true,// it will probably never be hide
        callback: close_panel
      }
    }// modal_data

    // i can also send an autorun prop and a callback which would allow me to run a request, get url data and send back 
    // the data by calling props.setQURL 
    // data[mode].callback({ setQURL });
    // const q_data = { 
    //   default: { 
    //     title, 
    //     description, 
    //     // btn_title,
    //     qURL: url,
    //     autorun,
    //   } 
    // };

    ReactDOM.render(
      <Modal data={modal_data} >
        <QRC {...{ data, autorun }} />
      </Modal>,
      qrc_modal_cont
    );
  }// start_modal

  return (
    <div className={`QRCodeCtrl${uuid} pp_panelCtrl${uuid} pp_panelCtrl ${name} ${project} QRCodeCtrl pp_panelBtn ${icon}`}
      onClick={(e) => {
        e.preventDefault();
        start_modal(e);
        e.stopPropagation();
      }}
    ></div>
  )
});

export default QRBtn;
