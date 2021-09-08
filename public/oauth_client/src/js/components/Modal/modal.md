# modal notes

DOCS: 
 - requires w3css.css
 - d3po.scss

the outer container need a z-index
the close button needs styling

CheckMate

has a container
```
  let hidden_cont = document.querySelector(".modal_home");
  let stk_vw_cont = document.createElement('div');
  stk_vw_cont.id = `stk_vw_cont${iUN}`;
  stk_vw_cont.className = `stk_vw_cont${iUN} stk_vw_cont w3-part block`;
  hidden_cont.appendChild(stk_vw_cont);

  let stkVw_el = <StackView data={{tVar}} />;

  ReactDOM.render(
    stkVw_el,
    stk_vw_cont
  );
```

#### Example generic modal with wrapper   

```
  const {wrapr} = require('./wrapr');

    ...


    // let hidden_cont = document.querySelector(".modal_home");
    // let stk_vw_cont = document.createElement('div');
    // stk_vw_cont.id = `stk_vw_cont${iUN}`;
    // stk_vw_cont.className = `stk_vw_cont${iUN} stk_vw_cont w3-part block`;
    // hidden_cont.appendChild(stk_vw_cont);

    let hold_temp_cont = wrapr({name:"stk_vw_cont", home: ".modal_home", custom:"w3-part block"});

		let modal_data = {
			name: "stk_view",
			tag: "core",
      // hasWrapper: true,
			// wrapper: {
			//   style:{
			//     zIndex: modal_z
			//   },
      // addClass: "some-class"
			// },
      modal: {
        addClass: "ComponentName"
      },
			content:{
				addClass:"hide-scroll"
			},
      // go:{
			// 	show: true,
			// 	callback: close_panel
      // },
			close:{
				show: true,
        addClass: "some special classes",
				// hide: modal_close_hide,// deprecated
				// hide: true,// probably will never be hide - does nothing
				callback: close_panel
			}
		}// modal_data

    let stkVw_el = (
      <Modal data={modal_data} >
        <StackView data={{tVar}} />
      </Modal>
      );

    ReactDOM.render(
      stkVw_el,
      stk_vw_cont
    );
```
**the modal can be added to the wrapper like above or the modal can be used inside the component which is added directly to the wrapper**

#### to show the top go btn
```
  go:{
    show: true,
    top: true,
    callback: upload_form
  },
```
**top: true**

#### example of generic close fn
close
```
	const close_panel = (e,obj) => {
		// i may not need this if there is a universal active/display class on all modals
		if(prefix.includes("arc")){
			// closing arc hides the core

		}else {
			// closing chk does a regular close
			obj.close();
		}

		//document.querySelector(".arc_popup_modal").classList.remove("block");// arc_popup
	}
```

hide
```
  	const close_panel = (e,obj) => {

  			document.querySelector(".arc_popup_modal_cont").classList.remove("block");// arc_popup_modal

  	}
```

#### example of generic go fn
```
      const upload_form = (e, obj) => {

        // close the modal
        uploadForm({state, form:{getValues}, store:FormStore},"").then(() => {
          FormStore.reset();
          obj.close();
        })


      }// upload_form
```

#### Sample modal data object

```
    let modal_data = {
      name: "details",
      tag,
      hide,
      wrapper: {
        addClass: "paper_modal",
        style:{
          zIndex: "3000"
        },
        attributes:{
          "data-page":data_id
        }
      },
      content:{
        addClass:"hide-scroll"
      },
      close:{
        show: show_close
      }
    }


    if(has_close_btn){
      modal_data.close.callback = delete_page;
      // modal_data.wrapper.attributes = {"data-page":data_id};// everything should have this attribute
    }

```

#### using hide
**adding hide to the modal_data object tell the close callback 'hide_me' (evoked on go also with a callback) to hide the modal don't remove it from the DOM**


#### using hasWrapper
> this is used to prevent react from filling the entirety of a given dom element (like using innerHTML) - using this multiple
childNodes can live in the same space - like using appendChild
```

  if(setup.hasWrapper){
    modal_data.hasWrapper = true;
  }
```

#### passing no_modal

```
if(setup.no_modal){
  modal_data.no_modal = true;
}
```
**this takes away the w3css class w3-modal. leaving everything else in tack including go, close and cancel btns.**

#### sample modal component
```
    return (
      <Modal data={modal_data}></Modal>
    );

    // or

    return (
      <Modal data={modal_data}>
        <Snapper ref={snapper_ref} data={ Snap_data }>
        {all_views}
        </Snapper>
      </Modal>
    );
```

```
  if(!hasWrapper){
    ReactDOM.unmountComponentAtNode(target_container);// this is like innerHTML = "" for react components
  }
  if(hasWrapper == true){
    // then remove the parent element
    let bigDaddy = target_container.parentNode;
    ReactDOM.unmountComponentAtNode(bigDaddy);
    // bigDaddy.removeChild(target_container);
  }// if
```
**i modified the original code to document the error that occurs when i try to remove a DOM element that wasn't created
with react - in this case i wrapped the component in a div and im trying to remove it with unmountComponentAtNode**
#### GOTCHA: unmountComponentAtNode(): The node you're attempting to unmount was rendered by React and is not a top-level container. Instead, have the parent component update its state and rerender in order to remove this component.


#### ReactDOM cant add multiple conponents to a container - its like using innerHTML = [dom item]
> my issues isn't the unmountComponentAtNode not able to delete the specific component, its that it can't delete the specific
component's wrapper that i had to make to add multiple components to the same parent element. (Aha)
```
  ReactDOM.render(
    page_modal,
    modal_home
  );
```

#### the easiest way to add childnodes and click closed
```
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

  //let hold_msg_text = "whats this?";
  let hold_msg_text = (
    <>
      {"You have list items selected in both hold and paper sections."}
      <br/> <br/>
      {"click"} <strong>{"ok"}</strong> {"or"} <strong>{"cancel"}</strong> {"to continue."}
    </>
  );

  let hold_msg_inner = (
    <div className="hold_msg_inner">
      <div className="hold_msg_text">{hold_msg_text}</div>
      <div className="hold_msg_btn btn w3-btn confirm" onClick={() => {

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

  // document.querySelector(`.hold_msg.closeBtn`).click();
```
sample.scss
```
  .hold_msg_inner{
    display: grid;
    grid-template-areas: "title title" "confirm deny";
    padding: 1rem;
    grid-template-rows: 3fr 1fr;
    gap: .5rem;
    .hold_msg_text{
      grid-area: title;
    }
    .hold_msg_btn{
      cursor: pointer;
      &.confirm{grid-area: confirm; background-color: #bdeabd;}
      &.deny{grid-area: deny; background-color: #eabdbd;}
    }
  }
```
#### remove the content border
```
  content:{
    addClass:"hide-scroll data_type" /*data_type added here helps modify the content border (glass_content)*/
  },
```

.scss
```
  .iWall_content.data_type {border: unset $mp;}

```

#### pass a reference to internal fn
```
    if(s.ref){
      s.ref.current = (modal: my_modal, close: hide_me}
    }
```

#### to set up single click action without the modal go btn
```
  const modal_ref = useRef();

```
**create a reference to the modal and pass it to the modal data**

```
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

  <Modal data={modal_data} >
  </Modal>
```

then add it to the click action fn
```
  if(single_click){

    let obj = modal_ref.current;
    obj.value = name;
    // obj.close();// works
    icon_go(e, obj);
  }
```
#### adding to the modal footer
```
  let remember_me = <CheckMate data={rem_data} />;

  //modal and snapper
  let modal_name = `${prefix}rF_Box`;

  let modal_data = {
    name: modal_name,
    tag: `rf_Box`,
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
      callback: close_bkmks
    },
    footer: CheckMate_me
  };
```

#### using hide and close btns together

_Page.js_

```
    let modal_data = {
      name: "details",
      tag,
      // ref: modal_ref,
      visible,
      wrapper: {
        addClass: "paper_modal",
        style:{
          zIndex: "3000"
        },
        attributes:{
          "data-page":data_id
        }
      },
      content:{
        addClass: `hide-scroll ${device_type}`
      },
      close:{
        icon:"cross",
        show: show_close
      },
      hide:{
        // show: show_close,
        show: false,
        icon:"cross",/*"compass"*/
        callback: paperStore.toggleShow
      }
    }


    if(has_close_btn){
      modal_data.close.callback = delete_page;
      // modal_data.wrapper.attributes = {"data-page":data_id};// everything should have this attribute
    }


    if(is_in_paper){
      modal_data.close.icon = "bin";
      modal_data.hide.show = show_close;
      modal_data.close.addClass = "bin";
    }else{
      modal_data.close.callback = close_detail;
    }
```
> i had to switch the hide and the go btns and modify their icons
> to do this i switched their callback and reassigned their icons

#### GOTCHA: modal takes some modifying to show right away. 
> it needs its own css and an inhanced z-index when testing
> 