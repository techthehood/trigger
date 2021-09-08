import React, { useContext } from 'react'
import ReactDOM from 'react-dom';
import { observer, inject } from "mobx-react";
const QRCode = require('qrcode.react');

const { wrapr } = require('../../tools/wrapr');
import Modal from '../Modal';
import QRC from './QRC';
require('./QRCoder.scss');
import { TriggerContext } from '../../triggerContext';

const QRCoder = observer(({
  icon,
  name = "",
  project = "",
  uuid = ""
}) => {
  
  const TriggerStore = useContext(TriggerContext);
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

    // let hidden_cont = document.querySelector(".modal_home");
    // let stk_vw_cont = document.createElement('div');
    // stk_vw_cont.id = `stk_vw_cont${iUN}`;
    // stk_vw_cont.className = `stk_vw_cont${iUN} stk_vw_cont w3-part block`;
    // hidden_cont.appendChild(stk_vw_cont);

    let qrc_modal_cont = wrapr({ name: "qrc_modal_cont", home: ".modal_home", custom: "w3-part block" });

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
        addClass: "ComponentName"
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
        addClass:"pp_btn icon-cross",
        // hide: modal_close_hide,// deprecated
        // hide: true,// it will probably never be hide
        callback: close_panel
      }
    }// modal_data

    let qrc_view_el = (
      <Modal data={modal_data} >
        <QRC />
      </Modal>
    );

    ReactDOM.render(
      qrc_view_el,
      qrc_modal_cont
    );
  }// start_modal

  return (
    <div className={`QRCodeCtrl${uuid} pp_panelCtrl${uuid} pp_panelCtrl ${name} ${project} QRCodeCtrl pp_panelBtn pp_btn icon-${icon}`}
      onClick={start_modal}
    ></div>
  )
});

export default QRCoder;
