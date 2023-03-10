import {useContext} from 'react'
import Modal from '../Modal';
import QRC from '../QRCoder/QRC';
import Snapper from '../Snapper/Snapper';
import Section from '../Snapper/Section';
import ProfileTree from '../ProfileTree';
import ErrorBoundary from '../Error';

import { qr_card_data, qr_sponsor_data } from '../QRCoder/QRCode.data';
import { TriggerContext } from '../../triggerContext';
import { exists, obj_exists } from '../../tools/exists';

const UserCard = (props) => {

  const {
    item,
    variant = "card",
    start_index = 0,
    store,
    // auto_editor = false,
  } = props;

  const triggerStore = store;
  const is_owner = triggerStore.type == "sponsor" && triggerStore.sponsor.sponsor_id == item.id ? true : false;

  const data = variant == "sponsor" ? qr_sponsor_data : qr_card_data;

  const close_panel = (e, obj) => {
    // close the modal
    e.preventDefault();
    obj.close();
  }// close_panel

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
      addClass: "UserCard"
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

  let snap_data = {
    name: "snap_core",
    // icons: ["user","qrcode"],/*"clock","bookmark","books"*/
    // labels: ["Div", "QRCode"],/*"clock","bookmarks","library"*/
    extras: {},
    add_options: true,
    auto_adjust: false,
    // iUN,/*doesn't need to add one */
    // section_callback: update_section,
    align: "bottom",
    mode: "scroll",
    start_ndx: start_index,
    // device_type,/*also not needed*/
    ctrl: {
      justify: "center",//"dots"
      style: {
        width: "1.75rem",
        margin: "5px"
      }
    }
  };

  let user_id = obj_exists(item, 'username') ? item.username : item._id;
  let card_data = { ...data };
  card_data.counselor.url = `${location.origin}/card/${user_id}`;

  return (
    <ErrorBoundary>
      <Modal data={modal_data} >
        <Snapper data={{ ...snap_data }}>
          <Section icon="user"><ProfileTree {...{ ...item, auto_editor: true, edit: is_owner,/*default_image, store: TriggerStore*/ }} /></Section>
          <Section icon="qrcode"><QRC {...{ data: card_data }} /></Section>
        </Snapper>
      </Modal>
    </ErrorBoundary>
  )
}// UserCard

export default UserCard
