
import React from 'react';
// console.log("Box ready");

const box = (props) => {
  let s = props.data;
  let name = s.name || "";
  let value = (s.value) ? unescape(s.value) : (props.children) ? props.children : "";
  /*helps a links href and link text be different*/
  let link_txt = (s.txt != undefined && s.txt != "none") ? s.txt : (s.txt != undefined && s.txt == "none") ? "" : value;
  let iUN = s.iUN || Math.round(Math.random() * 10000);
  let custom = (s.custom) ? s.custom: "";
  let sel_tag = (typeof value == "string" && value.indexOf("http") != -1) ? "a" : "div";
  let tag = (s.tag) ? s.tag : sel_tag;
  let attributes = s.attributes || {};
  let generic_id = (s.attributes == undefined && name != ""
    || s.attributes.id == undefined && name != "") ? {id:`${name}_TDTag_${iUN}`}: {};
  let custom_class = `${name}_TDTag${iUN} ${name}_TDTag LBTag ${name} ${custom} `;
  let generic_className = (s.attributes == undefined || s.attributes.className == undefined) ?
  {className:custom_class} : {};
  let target=s.target || "_blank";
  let event_obj = {};
  let no_bubble = (props.no_bubble) ? props.no_bubble: (s.no_bubble) ? s.no_bubble : false;
  let ret_El;
  let style = (typeof s.style != undefined) ? {style:s.style} : {};

  if(props.events || props.data != undefined && props.data.events){
    // create an array of event keys
    let event_data_obj = (props.events) ? props.events : props.data.events;
    let event_keys = Object.keys(event_data_obj);
    //iterate through them
    event_keys.forEach( key => {
      //isolate each key object
      let key_obj = event_data_obj[key];
      //[initial caps](https://paulund.co.uk/how-to-capitalize-the-first-letter-of-a-string-in-javascript)
      // prep js _? event str
      // doesn't work for react events i.e. onMouseDown etc
      // [react events](https://reactjs.org/docs/events.html)
      // let action = `on${key.charAt(0).toUpperCase() + key.slice(1)}`;//initial caps
      let action = key;//initial caps
      //create the event attribute & pass its props
      event_obj[action] = (e) => {
        e.persist();
        e.preventDefault();

        if(key_obj.data){
          let target = key_obj.target || e.target.id;
          if(typeof key_obj.callout != "undefined"){
            key_obj.callout(e,target,key_obj.data[0],key_obj.data[1],key_obj.data[2],key_obj.data[3]);
          }//if
        }else{
          // let e = (evt != undefined) ? evt : (event || window.event);
          //for anonymous functions
          if(typeof key_obj.callout != "undefined"){
            key_obj.callout(e);
          }//if
        }

        if(no_bubble == true)
        {
          e.stopPropagation();
          // LATER: stop react bubbling
          //React uses event delegation with a single event listener on document for events that bubble, like 'click'
          // in this example, which means stopping propagation is not possible

          // e.nativeEvent.stopImmediatePropagation();
          // https://stackoverflow.com/questions/24415631/reactjs-syntheticevent-stoppropagation-only-works-with-react-events
        }//if
      }
    });
  }

  let Custom_tag = tag;

  switch (tag) {
    case "a":
      ret_El = (<a {...generic_id}
      href={value} target={target} {...style}
      {...generic_className} {...attributes} {...event_obj}>
        {link_txt}
      </a>)
    break;
    case "input":
      ret_El = (<input {...generic_id} {...generic_className}
        {...attributes}  {...event_obj} {...style}/>);
    break;
    default:
      ret_El = (<Custom_tag {...generic_id} {...style}
      {...generic_className} {...attributes}  {...event_obj}>
        {value}
      </Custom_tag>);
  }



  return ret_El;
}

export default box;
