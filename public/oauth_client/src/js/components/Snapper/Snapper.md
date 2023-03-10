# Snapper.md

#### available modes
- scroll
- tabs

#### Sample snap data

```
    let dv_Snap_data = {
      name:"details_snap",
      icons:["link","share","bubble2"],
      iUN:s.iUN,
      align:"bottom",
      mode:"scroll",
      device_type,
      ctrl:{
        justify:"dots",
        style:{
          width:"1.75rem",
          margin:"5px"
        }
      }
    };
```

#### align options
align can be bottom, down, low, lower, under
**anything else will produce top mounted controls**

#### justify options
justify can be full, left, right, center & dots (which is also center)

#### mode options
mode can be scroll or tabs

#### Snap btn sample css

```
  .snap_btn{
    // margin: 2px 3px !important;
    // flex: 1 !important;
    // padding: 0px !important;
    &.dots{
      border-radius: 50% $mp;
      width: 1.5rem $mp;
      height: 1.5rem $mp;
      flex: unset $mp;
    }
    border-radius: 0px;
    height: 1.75em;
    line-height: 1.5;
  }/**/
```

the margin, fex and padding was available until i started to automatically configure the btns within the react component
if you need to override the configurations you can re-establish the css in the snapper.scss file   

#### create dots on the bottom   

```
  let dv_Snap_data = {
    name:"details_snap",
    icons:["link","share","bubble2"],
    iUN:s.iUN,
    align:"bottom",
    mode:"scroll",
    device_type,
    ctrl:{
      justify:"dots",
      style:{
        width:"1.75rem",
        margin:"5px"
      }
    }
  };
```
#### left tabs controls on top   

```
  let dv_Snap_data = {
    name:"details_snap",
    icons:["link","share","bubble2"],
    iUN:s.iUN,
    align:"top",
    mode:"tabs",
    device_type,
    ctrl:{
      justify:"left",
      style:{
        width:"1.75rem",
        margin:"5px"
      }
    }
  };
```

#### react component example   

```
  const react_modal = (
    <Modal data={modal_data}>
      <Snapper data={ Snap_data }>
        <Details data={data_obj} />
      </Snapper>
    </Modal>
  )

  ReactDOM.render(
    react_modal,
    modal_home
  );
```

#### custom icon class   

```
  let bkmk_Snap_data = {
    name:"bkmk_snap",
    icons:["star-full","clock","search"],
    labels:["favorites","recent","search"],
    icon_custom:"glass_ctrls lbx_ctrl_row  d3-ico d3-bg d3-disc-bg d3-card",
    // iUN:s.iUN,
    align:"top",
    mode:"tabs",
    device_type: state.device_type,
    show_head: true,
    head:{
      custom: "head_custom w3-card"
    }
    ctrl:{
      justify:"left",
      style:{
        display: "flex",
        alignItems: "center",
        flex: "1 !important",
        height: "35px",
        margin:"5px"
      }
    }
  };
```

add class to individual icons
snapper process   

```
  let icon_custom_str = (exists(icon_custom) && Array.isArray(icon_custom) && exists(icon_custom[ndx])) ? icon_custom[ndx] :
  (exists(icon_custom) && Array.isArray(icon_custom) && exists(icon_custom[0])) ? icon_custom[0] :
  (exists(icon_custom) && typeof icon_custom == "string") ? icon_custom : "";
  let active = (ndx == 0 ) ? "active" : "";
```

input data (takes string or array)   

```
  icon_custom:["class_item1", "class_item2"]

  // or

  icon_custom:["class_item"]

  // or

  icon_custom: "class_item"
```

#### how do i add a class to snap_section? (not snap_cont )
snapper process (takes objects or arrays)   

```
  let s_class = (exists(s.extras) && Array.isArray(s.extras) && exists(s.extras[ndx]) && exists(s.extras[ndx].section_class)) ? s.extras[ndx].section_class :
  (exists(s.extras) && Array.isArray(s.extras) && exists(s.extras[0]) && exists(s.extras[0].section_class)) ? s.extras[0].section_class :
  (exists(s.extras) && exists(s.extras.section_class)) ? s.extras.section_class : "";
```

use s.extras[ndx].section_class   

```
  snap_data.extras[0] = {section_class:'hide-scroll'}

  snap_data.extras = [{section_class:'hide-scroll'}]

  snap_data.extras = {section_class: 'hide-scroll'}

  //or

  let bkmk_Snap_data = {
    name:"bkmk_snap",
    icons:["bookmark2","clock","search"],
    labels:["favorites","recent","search"],
    icon_custom:"glass_ctrls lbx_ctrl_row  d3-ico d3-bg d3-disc-bg d3-card",
    // iUN:s.iUN,
    align:"top",
    mode:"tabs",
    device_type: state.device_type,
    show_head: true,
    head:{
      custom: "glass_title  arc_bkmk_list bkmk_list"
    },
    ctrl:{
      justify:"left",
      style:{
        display: "flex",
        alignItems: "center",
        flex: "1 !important",
        height: "35px",
        margin:"5px"
      }
    }
    // extras:[{section_class:'glass_content'}]/*works*/
    extras:{section_class:'glass_content'}/*works*/
  };
```

#### How do i delay a snapper section?
- see MainCore

- create a ref of an object that can hold the key value pair of each section
MainCore.js   

```
  const user_sections = useRef({});

```

- prep callback fn
MainCore.js   

```

  const update_section = (nbr, txt, ref_id) => {

    let init;

    if(typeof user_sections.current[ref_id] == "undefined") return;// do nothing
    init = user_sections.current[ref_id].state.init;
    // if not un the initial fn
    if(display_console || false) console.log("[user_recent] init",init, user_sections.current[ref_id].state.init);
    if(user_sections.current[ref_id].state.init == false){
      // user_sections.current[ref_id].fetch_info();
      user_sections.current[ref_id].initialize();
    }

  }// update_section
```

- attach each section's components to the user_sections object using a unique id
MainCore.js   

```
  let bkmk_id = `${sect.type}_${sect.name}`;
  user_sections.current[bkmk_id] = {};

  snap_content.push(
    <Segue mode="bookmarks"
      key={`arc_bookmarks_${iUN}`}
      section={sect}
      ref={user_sections.current[bkmk_id]}
      render="delay"
      payload={sect.name} store={state}
      name={sect.name} icon={sect.icon}
    />
  );
```

**GOTCHA: (fn component) make sure you set an empty object before using it as a ref**

- add the ref_id to snap_data through the extras prop
MainCore.js   

```
  snap_data.extras[snap_data.icons.length - 1] = {section_class:'hide-scroll', ref_id: bkmk_id}
```

- add the callback to snap_data
MainCore.js   

```
  let snap_data = {
    name:"snap_core",
    icons:[],/*"clock","bookmark","books"*/
    labels:[],/*"clock","bookmarks","library"*/
    extras:{},
    add_options: true,/*creates an option space for ReactDOM to render an option btn */
    // iUN,/*doesn't need to add one */
    section_callback: update_section,
    // align:"bottom",
    align:"export",// "bottom" /*why did i remove this feature from here? it seems to be working.*/
    export:"arc_footer",
    mode:"scroll",
    start_ndx: 1,
    // device_type,/*also not needed*/
    ctrl:{
      justify:"center",
      style:{
        width:"1.75rem",
        margin:"5px"
      },
      main:{custom:"hide-scroll"}
    }
  };

  // emphasis on section_callback
  // section_callback: update_section,
```
- create an initilize fn in the component to call init and render the display
Segue.js

```
  const delay = props.delay || false;
  let init = delay ? false : true;
  const [state, setState] = useState({init});

  const initialize = () => {
    if(display_console || true) console.warn("[Segue] initializing");
    setState({init:true});
  }
```

- if the component is a functional component use forwardRef to pass the ref to the component the same way you pass
  a ref to a class based component.  then add properties state and the initialize fn to the ref's object

```
  const Segue = forwardRef((props, ref) => {
    ref.state = state;// works
    ref.initialize = initialize;// works
```
remember ref was passed as .current[key] i.e. **ref={user_sections.current[bkmk_id]}**

- conditional state.init - show loader of display
Segue.js

```
  let loader = (
    <div className="loader_wrapper hide-scroll" >
      <div className="segue_item_loader loader reset-low"
        onClick={() => {
          if(display_console || true) console.warn(`[Arc] loader was clicked`);
          // iconWall_callback();
        }} >
        <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
      </div>
    </div>
  );

  let display_els = state.init ?  (
    <div className={`segue_view_wrapper ${name}`}></div>
  ) : loader;
```

#### add replacement icon and export to left/right

```
  if(has_profile_access){

    // prepare the profile component
    let snap_profile = React.memo(({callback}) => {
      return <ProfileIcon data={{ /*item:data,*/preset_data, name: "snap_profile", deep_dive:callback, /*init_stage: 3, fallback: "icon"*/}}/>
    })

    // customize the default/standard icon and label
    snap_data.icons.push("user");
    snap_data.labels.push("profile");

    // prep adding the section into the view
    snap_content.push(profile_view);// will be the component children nested inside the <Snapper> component

    // use extras to set up the replacement icon and the export to a side ctrl area
    snap_data.extras[snap_data.icons.length - 1] = {
      section_class:'hide-scroll',
      export: ".snap_ctrls_left.snap_core",/*push the custom icon into the export space of snap_ctrls_left*/
      replacement: snap_profile,/*sets a replacement icon to the default snapper icon*/
      ref_id: profile_id
    };

    // if home - set the start index to the profile
    if(section_home == profile_id){
      snap_data.start_ndx = snap_data.icons.length - 1;
    }
  }//if
```

#### add an external icon to the snap ctrls (snap_ctrls_left/snap_ctrls_right)

```
  let snap_data = {
    name:"snap_core",
    icons:[],/*"clock","bookmark","books"*/
    labels:[],/*"clock","bookmarks","library"*/
    extras:{},
    add_options: true,
    ...

  const add_option = () => {
    // add_option: true added to snap data to give a home space ".snap_ctrls_right" for option btn

    ReactDOM.render(
      <div className="snap_btn d3-ico d3-ico-btn icon-cog snap_core" title="options"
      onClick={(e) => {
        // console.warn("[options] clicked");
        section_selector();
      }}  ></div>,
      document.querySelector(".snap_ctrls_right.snap_core")
    )
  }// add_option

  useEffect(() => {
    // runs after component mounts to add btn that triggers the section_selector fn and opens SelectOptions component modal
    add_option();
  },[]);
```

> make sure snap_data has the "add_options" property set to true
> then use  useEffect to call a RenderDOM render to add the element after the component mounts

#### Add external icons directly

_MainCore.js_

```
  let right_ctrls = (true) ? [
    <div className="snap_btn d3-ico d3-ico-btn icon-cog snap_core"
      title="options"
      key={`snap_section_menu_${state.main_IUN}`}
      onClick={(e) => {
      // console.warn("[options] clicked");
      section_selector();
    }}></div>
  ] : [];

  let snap_data = {
    name:"snap_core",

    ...

    ctrl:{
      justify:"center",
      style:{
        width:"1.75rem",
        margin:"5px"
      },
      main:{custom:"hide-scroll"},
      left:{children:[<UserMenu key={`snap_user_menu_${state.main_IUN}`}/>]},
      right:{children:right_ctrls}
    }
  };
```
> I can pass html direcly to the props data and add it directly to its target wrappers   

_Snapper.js_   

```
  let left_children = (typeof s.ctrl &&
    typeof s.ctrl.left != "undefined" &&
    typeof s.ctrl.left.children != "undefined") ? s.ctrl.left.children : null;

  let right_children = (typeof s.ctrl &&
    typeof s.ctrl.right != "undefined" &&
    typeof s.ctrl.right.children != "undefined") ? s.ctrl.right.children : null;

    ...

  <div className={`${class_maker({prefix, name, main: "snap_ctrls_left", iUN})}`}>
    {left_children}
  </div>

  <div className={`${class_maker({prefix, name, main: "snap_ctrls_right", iUN})}`}>
    {dyn_ctrls}
    {right_children}
  </div>

```

#### Snapper start_ndx control

```
  paperStore.references[active_id].snap.current.goto_section(2);
```

```
  let snap_data = {
    name:"details_snap",
    // icons:["link", "share", "link"],
    iUN,
    //hide: true,
    mode:"scroll",
    // scroll: "hide",
    // section_callout: update_section,
    section_callback: update_section,
    start_ndx: 2,// 
    ctrl:{
      align:"bottom",
      justify:"dots",
      style:{
        width:"1.75rem",
        margin:"5px"
      }
    },
    extras:[]
  };
```

> paper.goto_section also controls the current section through force_scroll 
> snap_data.start_ndx does very little if anything at all - it triggers but if the snapper items 
> arent visible DOM elements scrollIntoView doesn't do anything.

#### This is the problem area in Snapper.js

_Snapper.js_

```
  componentDidMount = () => {
    if(display_console) console.log("[Snapper] component is ready to roll!");
    // if(display_console) console.log(`available data = ${this.props.data}`);

    let has_multi_children = (typeof this.props.children != "undefined" && !isNaN(this.props.children.length)) ? true : false;
        if(has_multi_children && this.state.init == false && typeof this.props.data.start_ndx != "undefined"){
          // start with the start prop
          let start_section = this.props.data.start_ndx;// convert to index style numbers (starts at zero not one)
          let snap_section_id = `snap_section_${this.state.iUN}_${start_section}`;
          let snap_section = document.querySelector(`.${snap_section_id}`);
          let mode = this.props.data.mode;
          if(mode == "scroll"){
            try {
              if(snap_section) snap_section.scrollIntoView();// not good for tab sections
            } catch (err) {
              console.error('[snapper] an error occured',err);
            }
          }else {
            this.show_section("","",{iUN:this.state.iUN, index:start_section, mode});// not great for scroll
          }

    ...
    
```