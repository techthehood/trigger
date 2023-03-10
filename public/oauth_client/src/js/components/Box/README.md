
#### Box example
```

  import React from 'react';
  console.log("Box ready");

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
          e.preventDefault();

          if(key_obj.data){
            let target = key_obj.target || e.target.id;
            key_obj.callout(e,target,key_obj.data[0],key_obj.data[1],key_obj.data[2],key_obj.data[3]);
          }else{
            // let e = (evt != undefined) ? evt : (event || window.event);
            //for anonymous functions
            key_obj.callout(e);
          }

          if(no_bubble == true)
          {
            e.stopPropagation();
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

```
**object name value pairs are translated into key=value in the jsx/html element**

Event breakdown
```
  atcName_events.onClick = {
    callout:attach_data,
    data:[
      {
        state:s.app_state,
        move_task:"attach"
      }
    ]
  }//click
```
**obj.onClick creates the event key that will be parsed Box**
```
let event_keys = Object.keys(event_data_obj);
//iterate through them
event_keys.forEach( key => {
  ...
```

#### This gets the object associated with the event keyName
```
  let key_obj = event_data_obj[key];

  //
  {
    callout:attach_data,
    data:[
      {
        state:s.app_state,
        move_task:"attach"
      }
    ]
  }//click
```

#### eventually we will piece together an event object with action as the key and a fn body as the value - adding the callout and any data given in the event data object
```
  let action = key;//initial caps
  //create the event attribute & pass its props
  event_obj[action] = (e) => {
    e.preventDefault();

    if(key_obj.data){
      let target = key_obj.target || e.target.id;
      key_obj.callout(e,target,key_obj.data[0],key_obj.data[1],key_obj.data[2],key_obj.data[3]);
    }else{
      // let e = (evt != undefined) ? evt : (event || window.event);
      //for anonymous functions
      key_obj.callout(e);
    }

    if(no_bubble == true)
    {
      e.stopPropagation();
    }//if
  }
```

#### finally the event will be added as a key:value pair to the jsx/html element
```
  (<Custom_tag {...generic_id} {...style}
  {...generic_className} {...attributes}  {...event_obj}>
    {value}
  </Custom_tag>);
```
**this will end up for example as: onClick=function(){...}**



#### attachOption using Box
```
    const attach_option = (props) => {
      //sample:
      // <AWrapr tVar={tVar} ></AWrapr>
      let tVar = props.tVar;
      let s = tVar.s;

      //deprecated - we're always in full mode now
      // if(s.app_state.data_mode == "full" ||
      // tVar.is_admin_data == "true" && tVar.is_native_data == "true" ||
      // tVar.test_class == " arc_collection " ){

        let iUN = s.iUN || Math.round(Math.random() * 10000);
        let value = "";//null; innerHTML

        let atcName = `my_info_attach_${tVar.binder}_${tVar.myIn_id}`;
        let atcName_cls_str = removeSomething.removeSomething(`${atcName} my_info my_info_attach icon-attachment d3-disc d3-disc-bg d3-ico d3-dot d3-hov-gold`," ");
        let atcName_attr = {
          id:`_${atcName}`,
          className:atcName_cls_str,
          "href":"#",
          title:"attach this to ?"
        };

        let atcName_events = {};

        atcName_events.onClick = {
          callout:attach_data,
          data:[
            {
              state:s.app_state,
              move_task:"attach"
            }
          ]
        }//click


        let atcName_obj = (
          <Box data={{
            tag:"button",
            attributes:atcName_attr,
            events:atcName_events
          }}>
          {value}
          </Box>
        );

        return atcName_obj;
      // }else{
      //   return null;
      // }//else

    }// attach_option
```

#### a verbose look at the Box data prop
```
  <Box data={{
    tag:"button",
    attributes:{
      id:`_${atcName}`,
      className:atcName_cls_str,
      "href":"#",
      title:"attach this to ?"
    },
    events:{
      onClick:{
        callout:attach_data,
        data:[
          {
            state:s.app_state,
            move_task:"attach"
          }
        ]
      }
    }
  }}
```
