// import ReactDOM from "react-dom";// it seems to already have the reference
console.log("[alight modal]");
require("./modal.scss");

const modal = (props) => {


  let s = props.data ? props.data : props;
  let name = s.name || "";
  let tag = s.tag || "";
  let value = (s.value) ? unescape(s.value) : (props.children) ? props.children : "";
  let iUN = s.iUN || Math.round(Math.random() * 10000);

  let visible = (typeof s.hide != undefined && s.hide) ? "" : "block";// visible by default unless hide is true
  let show_close_btn = true;
  let show_go_btn = false;
  let show_cancel_btn = false;
  let modal_addClass = (s.modal != undefined && s.modal.addClass != undefined) ? s.modal.addClass : "";
  let modal_cont_class = {className: `${name}_modal_cont_${iUN} ${name}_modal_cont ${tag} w3-modal ${modal_addClass} ${visible}`};
  let modal_class = {className: `${name}_modal_${iUN} ${name}_modal glassHouse ${tag} ${modal_addClass}`};
  let modal_style = {};
  let modal_txt = "";
  let content_addClass = (s.content != undefined && s.content.addClass != undefined) ? s.content.addClass : "";
  let content_class = {className: `${name}_content_${iUN} ${name}_content glass_content ${tag} ${content_addClass}`};
  let close_addClass = (s.close != undefined && s.close.addClass != undefined) ? s.close.addClass : "";
  let close_class = {className: `${name}_closeBtn_${iUN} ${name}_closeBtn modal_ctrls looking_glass d3-ico d3-bg d3-disc-outer d3-disc-bg d3-abs icon-cross ${tag} ${close_addClass}`};
  let close_title = {};
  let close_mode = "remove";
  let go_event_obj = {};
  let go_addClass = (s.go != undefined && s.go.addClass != undefined) ? s.go.addClass : "";
  let go_class = {className: `${name}_goBtn_${iUN} ${name}_goBtn modal_ctrls ${tag} d3-ico-full d3-disc-bg icon-checkmark ${go_addClass}`};
  let go_title = {};
  let cancel_addClass = (s.cancel != undefined && s.cancel.addClass != undefined) ? s.cancel.addClass : "";
  let cancel_class = {className: `${name}_cancelBtn_${iUN} ${name}_cancelBtn arc_can_btn ui-btn ${tag} ${cancel_addClass}`};
  let cancel_title = {};
  let cancel_txt = "";

    s.custom
    if(s.modal){
      let modal_obj = s.modal;
      modal_style = s.modal.style ? {style: s.modal.style} : {};

      if(modal_obj.className){
        modal_class = {className: modal_obj.className}
      }

      modal_txt = (modal_obj.txt) ? modal_obj.txt : "";
    }// if modal

    if(s.close){
      let close_obj = s.close;
      show_close_btn = (typeof s.close.show != undefined) ? s.close.show : true;
      close_mode = (s.close.hide == true) ? "hide" : "remove";

      if(close_obj.className){
        close_class = {className: close_obj.className}
      }

      close_title = (close_obj.title) ? {title: close_obj.title} : {};
    }// if close

    let hide_me = (e) => {
      console.log("[hide me]",this);
      let my_src = e.target;
      // use a css grid format to reduce containers/dom elements
      let target_parent = my_src.parentNode;
      let target_container = target_parent.parentNode.parentNode;

      if(close_mode == "hide"){
        // remove css style
      }else{
        // remove element
        // target_container.removeChild(target_parent);
        // target_container.classList.remove("block","w3-modal");
        ReactDOM.unmountComponentAtNode(target_container);
      }//else
    }

    if(s.content){

      let content_obj = s.content;

      if(content_obj.className){
        content_class = {className: content_obj.className}
      }// if

    }// if content

    // if there is a go property
  if(s.go){

    let go_obj = s.go;// it only comes in here if one of these exists
    show_go_btn = s.go.show || true;

    if(go_obj.className){
      go_class = {className: go_obj.className};
    }//

    // go button click event callout
    go_event_obj.onClick = (e) => {
      e.preventDefault();

      go_obj.callout(e);
    }//

    go_title = (go_obj.title) ? {title: go_obj.title} : {};

  }// if

  if(s.cancel){
    let cancel_obj = s.cancel;
    show_cancel_btn = s.cancel.show || true;

    if(cancel_obj.className){
      cancel_class = {className: cancel_obj.className}
    }

    cancel_txt = (cancel_obj.txt) ? cancel_obj.txt : "";
    cancel_title = (cancel_obj.title) ? {title: cancel_obj.title} : {};
  }// if cancel

  let close_btn = (show_close_btn == true) ? (<div {...close_class} onClick={hide_me} {...close_title} ></div>) : null;
  let modal_content = (
    <div {...content_class} >
    {value}
    </div>
  );

  let go_btn = (show_go_btn) ? (<div {...go_class} {...go_event_obj} {...go_title} ></div>) : null;
  let cancel_btn = (show_cancel_btn) ? (<div {...cancel_class} onClick={hide_me} {...cancel_title} >{cancel_txt}</div>) : null;



  const ret_El = (
    <div {...modal_home_class} >
      <div {...modal_class} {...modal_style} >
        {close_btn}
        {modal_content}
        {go_btn}
        {cancel_btn}
      </div>
    </div>
  );

  return ret_El;
}

export default modal;
