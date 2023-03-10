import /*React,*/ { useContext } from 'react'
import ReactDOM from 'react-dom';
import { observer, inject } from "mobx-react";

const { wrapr } = require('../../tools/wrapr');
import Modal from '../Modal';
import QRC from './QRC';
require('./QRCoder.scss');
import { TriggerContext } from '../../triggerContext';
import { qr_sponsor_data } from './QRCode.data';
import Snapper from '../Snapper/Snapper';
import Section from '../Snapper/Section';
import UserCard from '../UserCard/UserCard';

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

    let qrc_modal_cont = wrapr({ name: "qrc_modal_cont", home: ".modal_home", custom: "w3-part block" });

    let item = triggerStore.sponsor;
    item.id = item.sponsor_id;

    ReactDOM.render(
      <UserCard {...{store: TriggerStore, item, variant: "sponsor", start_index: 1}} />,
      qrc_modal_cont
    );
  }// start_modal

  return (
    <div className={`QRCodeCtrl${uuid} pp_panelCtrl${uuid} pp_panelCtrl ${name} ${project} QRCodeCtrl pp_panelBtn pp_btn svg-icon-${icon}`}
      onClick={start_modal}
    ></div>
  )
});

export default QRCoder;
