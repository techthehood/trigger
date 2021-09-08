

the warn modal takes the target function to be executed as a callback.  this modal pauses the normal execution of the target function
until the confirm btn is clicked.
```
  import Modal from '../elements/Modal/Modal';

  const {wrapr} = require('./wrapr');
  export const warn_modal = ({msg, callback, data = "", prefix = "", iUN=""}) => {

      let hold_temp_cont = wrapr({name:"hold_temp_cont", home: ".modal_home", custom:"w3-part block"});

      let modal_name = `${prefix}hold_msg`;
      let modal_data = {
        name: modal_name,
        tag: `rf_Box hold_msg`,
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
      // document.querySelector(`.hold_msg.closeBtn`).click();
      let hold_msg_text = (
        <>
          {msg}
          <br/> <br/>
          <div className={`hold_msg_instructions`}>
            {"click"} <strong>{"ok"}</strong> {"or"} <strong>{"cancel"}</strong> {"to continue."}
          </div>
        </>
      );

      let hold_msg_inner = (
        <div className="hold_msg_inner">
          <div className="hold_msg_text">{hold_msg_text}</div>
          <div className="hold_msg_btn btn w3-btn confirm" onClick={(e) => {
            callback(e, callback, data);
            document.querySelector(`.hold_msg.closeBtn`).click();
          }}>Ok</div>
          <div className="hold_msg_btn btn w3-btn deny" onClick={() => {

            document.querySelector(`.hold_msg.closeBtn`).click();
          }}>Cancel</div>
        </div>
      )


      ReactDOM.render(
        <Modal data={modal_data}>
          {hold_msg_inner}
        </Modal>,
        hold_temp_cont
      );

    }// warn_modal


  // usage:
  // const {warn_modal} = require('../../../tools/warn_modal');
  // let msg = "You have list items selected in both hold and paper sections.";
  // warn_modal({msg, callout: remove_items});

  // on confirm call the callback remove_items

```
