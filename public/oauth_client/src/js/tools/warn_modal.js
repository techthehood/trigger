  import ReactDOM from 'react-dom';
  import Modal from '../elements/Modal/Modal';
  require('./warn_modal.scss');
  const {exists} = require('./exists');

  const {wrapr} = require('./wrapr');
   export const warn_modal = ({
     msg,/*msg can be jsx - see usecase in the comment below*/
     callback,
     footer,
     modal_footer,
     data = "",
     prefix = "",
     home = ".modal_home",
     iUN="",
     name = "warn",
     tag = "",
     modal_wrap_tag = "",
     go_text = "Ok",
     to_action = "to continue.",
     inform = false,
     cancel_text = "Cancel",
     hasWrapper = false
   }) => {

      let warn_temp_cont = wrapr({name:`${name}_temp_cont`, home, custom:`w3-part block ${tag}`});
      let mode = (callback && inform == false) ? "confirm" : "inform";

      let modal_name = `${prefix}${name}_msg`;
      let modal_data = {
        name: modal_name,
        hasWrapper,
        tag: `rf_Box ${name}_msg warn_msg ${mode} ${tag}`,
        modal: {
          style:{
            zIndex: "3000"
          }
        },
        content:{
          addClass:"hide-scroll"
        },
        close:{
          show: true,
          // callback: close_bkmks
        }
      };

      if(exists(modal_wrap_tag)){
        modal_data.wrapper = {addClass:modal_wrap_tag};
      }// if

      if(modal_footer){
        modal_data.footer = modal_footer;
      }// if
      // document.querySelector(`.${name}_msg.closeBtn`).click();
      let warn_msg_text = (
        <>
          {msg}
          {callback ? <div className={`${name}_msg_instructions warn_msg_instructions`}>
            {"click "}
            <strong>{go_text}</strong>
            {`${ mode == "confirm" ? " or " : ""}`}
            {mode == "confirm" ? (
              <strong>{cancel_text} </strong>
            ) : null}
            {` ${to_action}`}
          </div> : null}
        </>
      );
      // have to get the spaces just right

      let warn_msg_inner = (
        <>
        <div className={`${name}_msg_inner warn_msg_inner ${mode}`}>
          <div className={`${name}_msg_text warn_msg_text`}>{warn_msg_text}</div>
          <div className={`${name}_msg_btn warn_msg_btn btn w3-btn confirm`} onClick={(e) => {
            if(callback){
              callback(e,data);
            }
            document.querySelector(`.${name}_msg.closeBtn`).click();
          }}>{go_text}</div>
          {mode != "inform" ? <div className={`${name}_msg_btn warn_msg_btn btn w3-btn deny`} onClick={() => {

            document.querySelector(`.${name}_msg.closeBtn`).click();
          }}>{cancel_text}</div> : null}
        </div>
        {footer ? (
          <div className={`${name}_msg_footer warn_msg_footer`}>
            {footer}
          </div>
        ) : null}
        </>
      )


      ReactDOM.render(
        <Modal data={modal_data}>
          {warn_msg_inner}
        </Modal>,
        warn_temp_cont
      );

    }// warn_modal


  // usage:
  // const {warn_modal} = require('../../../tools/warn_modal');
  // let msg = "You have list items selected in both hold and paper sections.";
  // warn_modal({msg, callout: remove_items, name:"hold"});

  // on confirm call the callback remove_items

  // html element use case

  // let msg = (
  //   <>
  //     <p>{"Do you want to "+ msg_type + " the selected files to the following location?"}</p>
  //     <p><strong>{
  //     [
  //     unescape(title_desc),
  //     " title: ",
  //     unescape(binder_title)
  //     ].join("")
  //     }</strong></p>
  //     <p>({msg_adtn})</p>
  //   </>
  // )
  // ;
  //
  // warn_modal({msg, callback: process_move, name: "hold"});
