
  import { Component, createRef } from 'react';//needed for React.Component
  import Box from '../Box/Box';
  import Exporter from '../Exporter';
  require('./snapper.scss');
  const {bboy} = require('../../tools/stringMe.js');
  const {exists, obj_exists} = require('../../tools/exists');
  const {demo} = require('../../tools/demo');
  const {class_maker} = require('../../tools/class_maker');
  // const {my_storage} = require('../../my_storage');
const { get_device } = require('../../tools/get_device.js');// ISSUE: should this be in core? should Paper? - how many external
  const {toaster} = require('../Toast/toaster');
  const {cycle} = require('../../tools/cycle');
  //components will use it?
  const display_console = false;


  export default class Snapper extends Component {

      constructor(props){
        super(props);

        let s = (typeof this.props.data != undefined) ? this.props.data : this.props;
        // let ctrl_align = (this.exists(s.ctrl) && this.exists(s.ctrl.align) ) ? s.ctrl.align : (this.exists(s.align)) ? s.align : "top";/* bottom, low, lower - anything else will be top */

        this.state = {
          iUN:(props.iUN) ? props.iUN : Math.round(Math.random() * 10000),
          init:false,
          force_scroll: false,
          force_section:0,
          current_section: 0,
          auto_adjust: typeof s.auto_adjust != "undefined" ? s.auto_adjust : true,
          export_obj:(this.exists(s.ctrl) && this.exists(s.ctrl.export) ) ? s.ctrl.export : (this.exists(s.export)) ? s.export : "",
          orientation_ctrls:s.orientation_ctrls || false,
          // ctrl_align,
          align_filter: s.align_filter || ["bottom","left","top","right"],
          section_callback: (typeof props.data != "undefined" && typeof props.data.section_callback != "undefined") ? props.data.section_callback : undefined
        };

        this.init_section = createRef();// can't set default like useRef([]); - need two separate statements
        this.init_section.current = [];// fix for running twice during init due to conponentDidMount/Update
        this.force_scroll = createRef();
        this.force_scroll.current = false;
        this.force_section = createRef();
        this.force_section.current = 0;

        this.snap_ctrls_main = createRef();
        this.snap_ctrls_main_orient = createRef();// informs icon placemenet (center or flex-start)
        this.snap_ctrls_main_orient.current = obj_exists(s,"ctrl.justify") ? s.ctrl.justify : "left";
        // debugger
      }//

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

        // this.setState({init: true, current_section: start_section});// Core hack
        this.active_section();// Core hack
      }

      // this.prep_vars(this.props.data);
    }//componentDidMount

    componentDidUpdate = () => {

      if(/*this.state.force_scroll == true &&*/ this.force_scroll.current == true)
      {

        if(display_console || true) console.warn(`[Snapper] force_scroll detected `);

        let mode = this.props.data.mode || "scroll";

        let labels_array = this.get_all_labels(this.props);

        // this.props.data.labels
        let forced_index = (isNaN(this.force_section.current)) ?
          labels_array.indexOf(this.force_section.current) :
        this.force_section.current;

        this.show_section('','',{iUN: this.state.iUN, index: forced_index, mode});
        // this.setState({force_scroll: false});
      }

      // why is this running in evey condition?
      this.active_section("",false);//Core hack to fix store change of snapper children

      // prepare to force a change if its different
      let last_orient = this.snap_ctrls_main_orient.current;

      // this controls the justification of the main ctrl btns
      // - if there are more than the view it will justify them left otherwise it will leave them center
      if(this.snap_ctrls_main.current != undefined) {
        // get the bounding width and the scroll width
        let bounding = this.snap_ctrls_main.current.getBoundingClientRect();
        let scroll_width = this.snap_ctrls_main.current.scrollWidth;

        // if the scroll width exceeds the bounding width justify left, otherwise justify center
        if(this.state.auto_adjust){
          if(scroll_width >= bounding.width){
            // this has nothing to do with where the toolbar is placed and has everything to do with where the icons
            // are placed in their container, whether centered or flex-start
            this.snap_ctrls_main_orient.current = "left";
          }else{
  
            this.snap_ctrls_main_orient.current = "center";
          }// else
  
          // if the orientation has changed, force render
          if(last_orient != this.snap_ctrls_main_orient.current){
            this.forceUpdate();
          }
        }// auto_adjust
      }// if

    }/*componentDidUpdate*/

    get_all_labels = props => {
      let l_ary = !Array.isArray(props.children) ? [props.children] : props.children;

      let labels = l_ary.map((node) => {
        return node.props.label;
      });

      return labels;
    }

    snap = dObj => {


    }// share_me

    exists = (item) => {
      return (item != null && typeof item != "undefined" && item != false) ? true : false;
    }

    htmlDecode = input =>
    {
      var doc = new DOMParser().parseFromString(input, "text/html");
      return doc.documentElement.textContent;
    }//end htmlDecode

    goto_section = (val) => {
      if(display_console || true) console.warn(`[Snapper] goto_section value = `,val);
      this.force_scroll.current = true;
      this.force_section.current = val;
      this.forceUpdate();
      // this.setState({force_scroll: true, force_section: 1})
    }

    show_section = (e, targ, data) => {
      try {
        
        // fix for the click delay
        if(typeof e != "undefined" && typeof e.target != "undefined"){
          // try activating the target first
          let targetBtns = [...document.querySelectorAll(".snap_btn")];
          targetBtns.forEach((btn) => {
            btn.classList.remove("active");
          })
          e.target.classList.add("active");
        }

        if(display_console) console.log("[show section running]");
        let iUN = data.iUN,
        ndx = data.index,
        mode = data.mode,
        section_class = `.snap_section_${iUN}_${ndx}`,
        target = document.querySelector(section_class),
        all_targets,
        btn_class,
        targ_btn,
        all_btns;


        switch (mode) {
          case "scroll":
            // let _this = this;
            // if(this.force_scroll.current == true){
            //
            //   let intersectionObserver = new IntersectionObserver((entries) => {
            //     // If intersectionRatio is 0, the target is out of view
            //     // and we do not need to do anything.
            //     if (entries[0].intersectionRatio <= 0) return;
            //     _this.force_scroll.current = false;
            //     intersectionObserver.unobserve(entries[0].target);
            //     // loadItems(10);
            //     // console.log('Loaded new items');
            //   });
            //   // start observing
            //   intersectionObserver.observe(target);
            // }

            // why did i have this !this.force_scroll.current - maybe i just wanted it to jump to the spot without a slow motion
            let behavior_obj = (!this.force_scroll.current) ? {
              behavior: 'smooth',
              block: 'nearest'
            } : {};
            // [fix for scrollIntoView ](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView)

            target.scrollIntoView(behavior_obj);// can i run this later in

            this.force_scroll.current = false;

          break;

          default:
            section_class = `.snap_section`;
            all_targets = document.querySelectorAll(section_class);

            btn_class = `snap_btn_${iUN}`;


            all_targets.forEach((item) => {
              item.classList.remove("show");
            })

            target.classList.add("show");

            // activate the btn display with the click color
            targ_btn = document.querySelector(`.${btn_class}_${ndx}`);
            all_btns = document.querySelectorAll(`.${btn_class}`);

            all_btns.forEach((item) => {
              item.classList.remove("active");
            })
            targ_btn.classList.add("active");

            // scroll updates the state. tab option does not
            let prep_state = {current_section: ndx};
            this.setState(prep_state);
        }// switch
      } catch (error) {
        console.error(`[snapper] an error occured`, error);
      }
    }// show_section

    isScrolling;

    active_section = (e,sv = true) => {
      if(e && e != "") e.preventDefault();// Core hack

      let snapper = this;
      let iUN = snapper.state.iUN;
      let scrollBox = (typeof e != "undefined" && e != "") ? e.target : document.querySelector(`.snap_cont_${iUN}`);// Core hacks

      //limit the scroll actions to snapper container
      if(scrollBox.classList.contains(`snap_cont_${iUN}`) == false){{return}}
      // Clear our timeout throughout the scroll
  	   window.clearTimeout( snapper.isScrolling );
       let exists = snapper.exists;

  	   // Set a timeout to run after scrolling ends
    	snapper.isScrolling = setTimeout(() => {

        let found_it = false;
    		// Run the callback
    		if(display_console) console.log( 'Scrolling has stopped.' );
        // if(display_console) console.log(`[scrollbox] scrollLeft`,scrollBox.scrollLeft);
        let scroll_edge = scrollBox.scrollLeft;
        // if(display_console) console.log(`[scrollbox] offsetWidth`,scrollBox.offsetWidth);
        let ctrls = scrollBox.childNodes;
        ctrls.forEach((item, ndx) => {
          // if(display_console) console.log(`[ctrl${ndx}] offsetLeft`,item.offsetLeft);
          // if(display_console) console.log(`[ctrl${ndx}] offsetWidth`,item.offsetWidth);
          // let item_edge = item.offsetLeft + item.offsetWidth;// right Edge
          let item_edge = item.offsetLeft + (item.offsetWidth * .75);// 3/4 Edge
          // if(display_console) console.log(`[ctrl${ndx}] item edge`,item_edge);
          let btn = document.querySelector(`.snap_btn_${iUN}_${ndx}`);

          let child_nodes = !Array.isArray(snapper.props.children) ? [snapper.props.children] : snapper.props.children;

          if(found_it == false && item_edge > scroll_edge){
            found_it = true;
            // if(display_console) console.log(`[current itemt] = `,ndx
            if(exists(btn)){
              btn.classList.add("active");
            }
            if(display_console) console.log( '[Snapper] active section index is ', ndx );
            let prep_state = {current_section: ndx};

            // sets the init property here so i can run this inside of componentDidMount
            if(snapper.state.init == false){prep_state.init = true;}// Core hack

            //skip creating a state loop when fn comes from componentDidUpdate
            if(sv == true) snapper.setState(prep_state);// Core hack - fix for componentDidUpdate
            // let data = (typeof snapper.props.data != undefined) ? snapper.props.data : snapper.props;
            let data = child_nodes[ndx].props;

            // if(Array.isArray(data.labels) && data.labels[ndx] && !snapper.init_section.current.includes(data.labels[ndx])){
            if(!snapper.init_section.current.includes(data.label)){
              // what does this button do?
              snapper.init_section.current.push(data.labels);// fix for running twice during init due to conponentDidMount/Update
            }//if

            if(exists(snapper.state.section_callback)){
              // let extra_id = (exists(data.extras) && exists(data.extras[ndx]) && exists(data.extras[ndx].ref_id)) ? data.extras[ndx].ref_id : undefined;
              // let back_label = (Array.isArray(data.labels) && data.labels[ndx]) ? data.labels[ndx] : undefined;
              // snapper.state.section_callback(ndx,back_label,extra_id);// Core hack - add labels
              let extra_id = (obj_exists(data.extra,"ref_id")) ? data.extra.ref_id : undefined;
              let back_label = (data.label) ? data.label : undefined;
              snapper.state.section_callback(ndx, back_label, extra_id);// Core hack - add labels
            }//if section_callback
          }else{
            if(exists(btn)){
              btn.classList.remove("active");
            }
          }
        });

    	}, 66);
    }// active_section

    recycle = (cA) => {
      // ctrl_align is local to Snapper's state not the app_state
      console.debug(`[Snapper] triggering recycle`)
      let next_value = cycle({ array: this.state.align_filter, value: cA});
      // this.setState({ctrl_align:next_value});

      // save ctrl_align (alignment) for next visit using main_ctrls
      // let user_prefs = my_storage({request:"user_prefs",update: {main_ctrls: next_value}});
      // user_prefs = typeof user_prefs != "string" ? JSON.stringify(user_prefs) : user_prefs;// the need for user_prefs is deprecated

      // conditionally update an extrenal state
      if(obj_exists(this,"props.data.recycle")) this.props.data.recycle({next_value});

      // toaster({name:"snap_toast",message:`[recycle] user_prefs =  ${user_prefs}`, auto:false});
    }// recycle

    // update_user_prefs = async () => {
    //   // get user_prefs from my_storage
    //   let user_prefs = await my_storage({request:"user_prefs"});
    //
    //     // prepare the current user_prefs for additional data
    //     let temp_user_prefs = (typeof user_prefs == "string") ? JSON.parse(user_prefs) : {...user_prefs};// its a string
    //
    //     // add filter data and user_id data
    //     temp_user_prefs.main_ctrls = ;
    //
    //     // send the updated user_prefs to the storage
    //     let updated_prefs = await my_storage({request:"user_prefs",update:{...temp_user_prefs}});
    //     console.log("user_prefs = ",updated_prefs);
    // }

    render(){

      let myProps = this.props;
      // add_options adds a left_ctrls and right_ctrls space for other btns to be added to, either by using the 
      // designated left_/right_children (or possibly adding them through the DOM)
      let add_options = (this.props.data.add_options == true || this.state.orientation_ctrls == true) ? true : false;
      let orientation_ctrls  = this.state.orientation_ctrls;

      if(typeof myProps != "undefined"){
        let s = (typeof this.props.data != undefined) ? this.props.data : this.props,
        name = s.name,
        prefix = "",
        tag = s.tag || "",
        mode = s.mode || "scroll",/* tabs scroll*/
        icons = s.icons || ["default"],
        icon_class = s.icon_class || "",
        icon_custom = s.icon_custom || "",
        item_dots = {},
        iUN = this.state.iUN,
        device_type = s.device_type || get_device({mode:"type"}),
        custom = (s.custom) ? s.custom: `test_green ui-btn ui-icon-${icons[0]} ui-btn-icon-notext ui-shadow ui-corner-all ui-mini`,
        labels =  s.labels || ["default"],
        section_class = s.section_class || [],
        ctrl_align = (this.exists(s.ctrl) && this.exists(s.ctrl.align) ) ? s.ctrl.align : (this.exists(s.align)) ? s.align : "top",/* bottom, low, lower, down - anything else will be top */
        // ctrl_align = this.state.ctrl_align,
        // export_obj = (this.exists(s.ctrl) && this.exists(s.ctrl.export) ) ? s.ctrl.export : (this.exists(s.export)) ? s.export : "",
        export_obj = this.state.export_obj,
        export_class = (export_obj != "") ? export_obj.home : "",
        ctrl_item_style = {},
        ctrl_cont_style = {},
        ctrl_cont_class = (this.exists(s.ctrl) && this.exists(s.ctrl.custom) ) ? s.ctrl.custom : "",
        ctrl_main_class = (this.exists(s.ctrl) && this.exists(s.ctrl.main)  && this.exists(s.ctrl.main.custom)  ) ? s.ctrl.main.custom : "",
        ctrl_width = "30px",
        ctrl_tag = "",
        snap_btns = [],
        justify = s.justify || "dots",// expecting left right center or dots
        scroll_hider = (typeof s.scroll != "undefined" && s.scroll == "hide") ? "hide-scroll" : "";

        let head_custom = (exists(s.head) && exists(s.head.custom)) ? s.head.custom : ""
        let snap_head = ((exists(s.show_head) || exists(s.head)) && labels[0] != "default") ? (
          <div className={`snap_head_${iUN} snap_head ${head_custom}`}>
            {labels[this.state.current_section]}
          </div>
        ) : null;



        if(typeof s.ctrl != "undefined"){
          let has_ctrl_style = (typeof s.ctrl.style != "undefined") ? true : false;
          let ctrl_style_input = (typeof s.ctrl.style != "undefined") ? {...s.ctrl.style} : {};
          // let ctrl_style_input = (typeof s.ctrl.style != "undefined") ? bboy(s.ctrl.style, true) : {};
          let mod_ctrl_style = {...ctrl_style_input};
          // let mod_ctrl_style = bboy(ctrl_style_input, true);
          let mod_cont_style = {};
          ctrl_align = (typeof s.ctrl.align != "undefined") ? s.ctrl.align : ctrl_align;
          ctrl_tag = (typeof s.ctrl.tag != "undefined") ? s.ctrl.tag : "";
          justify = (typeof s.ctrl.justify != "undefined") ? s.ctrl.justify : justify;

          ctrl_width = (typeof s.ctrl.style != "undefined" && typeof s.ctrl.style.width != "undefined") ? s.ctrl.style.width :
          (typeof s.ctrl.width != "undefined") ? s.ctrl.width : ctrl_width;

          let item_default = (exists(s.ctrl) && exists(s.ctrl.style) && exists(s.ctrl.style.flex)) ? {} : {
            flex: `0 0 ${ctrl_width}`
          };

          // create a hypothetical margin
          let ctrl_margin = (typeof s.ctrl.margin != "undefined") ? {margin: s.ctrl.margin} : {};
          item_default = { ...item_default, ...ctrl_margin};

          // create a hypothetical padding
          let ctrl_padding = (typeof s.ctrl.padding != "undefined") ? {padding: s.ctrl.padding} : {};
          item_default = { ...item_default, ...ctrl_padding};

          //
          switch (justify) {
            case "full":
                let item_stretch = {
                  flex: "1 1"
                };
                // mod_ctrl_style = {...mod_ctrl_style, ...item_stretch};
                mod_ctrl_style = Object.assign({},mod_ctrl_style, item_stretch);
              break;
            case "left":
                let cont_flex_left = {
                  justifyContent: "flex-start"
                }
                // mod_cont_style = {...mod_cont_style, ...cont_flex_left};
                mod_cont_style = Object.assign({}, mod_cont_style, cont_flex_left);

              break;
            case "right":
                let cont_flex_right = {
                  justifyContent: "flex-end"
                }
                // mod_cont_style = {...mod_cont_style, ...cont_flex_right};
                mod_cont_style = Object.assign({}, mod_cont_style, cont_flex_right);
              break;
            case "dots":
              item_dots = {
                borderRadius: "50%"
              };
            case "center":
                let cont_center = {
                  justifyContent: "center"
                }
                // mod_cont_style = {...mod_cont_style, ...cont_center, ...item_dots};
                mod_cont_style = Object.assign({}, mod_cont_style,  cont_center,  item_dots);
              break;
            default:

          }//switch

          // prep for use as a style
          ctrl_cont_style = (justify != "full") ? {style: mod_cont_style} : {};

          // pass the ctrl_style to the Box component's data object
          // mod_ctrl_style = (justify != "full") ? {...mod_ctrl_style, ...item_default} : mod_ctrl_style;
          mod_ctrl_style = (justify != "full") ? Object.assign({}, mod_ctrl_style, item_default) : mod_ctrl_style;

          // ctrl_item_style = {...mod_ctrl_style};
          ctrl_item_style = Object.assign({}, mod_ctrl_style);

        }//if

          // let section_icons = (icons[0] != "default") ? icons : labels;// what is this for? it does nothing;

          // child_array is taken from the chidren nested in the <Snapper> component
          let child_array = (typeof myProps.children == "undefined") ? [] : (isNaN(myProps.children.length) || !Array.isArray(myProps.children)) ? [myProps.children]: myProps.children;


          snap_btns = child_array.reduce((result, child_node, ndx) => {

            let icon_str = child_node.props.icon;//icons[ndx];// LATER: update its detection. what if its undefined or a generic value like default
            // let custom_icon_class = (exists(icon_class) && icon_class.length != 0) ? icon_class[ndx] : "d3-ico d3-ico-btn";
            let custom_icon_class = (obj_exists(child_node.props, "icon_class")) ? child_node.props.icon_class : "d3-ico d3-ico-btn";
            // let icon_custom_str = (exists(icon_custom) && Array.isArray(icon_custom) && exists(icon_custom[ndx])) ? icon_custom[ndx] :
            // (exists(icon_custom) && Array.isArray(icon_custom) && exists(icon_custom[0])) ? icon_custom[0] :
            // (exists(icon_custom) && typeof icon_custom == "string") ? icon_custom : "";
            let icon_custom_str = (obj_exists(child_node.props, "icon_custom")) ? child_node.props.icon_custom : "";
            let active = (ndx == 0 ) ? "active" : "";
            let custom = (justify != "dots") ?
            `${class_maker({prefix, name, main: "snap_btn", iUN, ndx})} ${icon_str}_icon ${device_type} snap_btn ${custom_icon_class} ${icon_custom_str} icon-${icon_str} ${ctrl_tag} ${active}` :
            `${class_maker({prefix, name, main: "snap_btn", iUN, ndx})}  ${device_type} snap_btn ${custom_icon_class} ${icon_custom_str} ${ctrl_tag} ${justify} ${active}`;

            let attributes = {
              "data-index": ndx,
              "data-iun":iUN
            };

            let cP = child_node.props;


            // if(typeof labels[ndx] != "undefined") data.attributes.title = labels[ndx];
            if (typeof child_node.props.label != "undefined") attributes.title = child_node.props.label;
            // if(exists(s.extras) && Object.keys(s.extras).length != 0 && exists(s.extras[ndx]) && exists(s.extras[ndx].ref_id)){
            //   attributes[`data-ref_id`] = s.extras[ndx].ref_id;
            // }// ref_id
            if (obj_exists(cP.extra,"ref_id")) {
              attributes[`data-ref_id`] = cP.extra.ref_id;
            }// ref_id

            // let has_replacement = (exists(s.extras) && Object.keys(s.extras).length != 0 && exists(s.extras[ndx]) && exists(s.extras[ndx].replacement)) ? true : false;
            // let Replacement = (has_replacement) ? s.extras[ndx].replacement : null;
            let has_replacement = (obj_exists(cP.extra,"replacement")) ? true : false;
            let Replacement = (has_replacement) ? cP.extra.replacement : null;

            // if it has a replacement btn then use the replacement otherwise use the standard btn
            let mybtn = (has_replacement) ? (
              <Replacement key={`snap_btn_rpl_${ndx}`} callback={(e) => {
                e.preventDefault();
                e.persist();
                let _this = this;
                demo(e.target, () => {
                  _this.force_scroll.current = false;
                  _this.show_section(e,"",{iUN, index:ndx, mode});
                },true);// demo
              }}/>
            ) : (
              <div className={`${custom}`} style={ctrl_item_style} {...attributes}
                key={`snap_btn_${iUN}_${ndx}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.persist();
                  let _this = this;
                  demo(e.target, () => {
                    _this.force_scroll.current = false;
                    _this.show_section(e,"",{iUN, index:ndx, mode});
                  },true);// demo
                  }}>{justify != "dots" && !child_node.props.icon ? child_node.props.label : null}</div>
            );// if there is no icon && not using dots use the label

            // let has_export =  (exists(s.extras) && Object.keys(s.extras).length != 0 && exists(s.extras[ndx]) && exists(s.extras[ndx].export)) ? true : false;
            // let has_export = (obj_exists(s.extras,"export")) ? true : false;
            let has_export = (obj_exists(cP.extra, "export")) ? true : false;

            mybtn = has_export ? (
              // <Exporter data={{home: s.extras[ndx].export, delay: 1}} key={`snap_btn_exporter_${iUN}_${ndx}`}>
              <Exporter data={{ home: cP.extra.export, delay: 1 }} key={`snap_btn_exporter_${iUN}_${ndx}`}>
                {mybtn}
              </Exporter>
            ) : mybtn;

            result.push(mybtn);

            return result;
          },[]);// snap_btns child_array reduce

          // d3-disc d3-disc-bg d3-bg d3-disc-outer

          // im not using the value itself because i want to display the icon of the next position in the array using cycle
          let icon_value = (this.state.orientation_ctrls == true) ?
          cycle({ array: this.state.align_filter, value: ctrl_align }) : "";// this.state.ctrl_align

        // let icon_value = (this.state.orientation_ctrls == true) ? this.state.ctrl_align : "";// for direct tests
          
          let dyn_ctrls = (this.state.orientation_ctrls == true) ? (
            <div  className={`snap_dyn_ctrls snap_dyn_ctrls_${iUN} d3-ico icon-circle-${icon_value == "bottom" ? "down" : icon_value}`}
              onClick={(e) => {
                let _this = this;
                demo(e.target, () => {
                  _this.recycle(ctrl_align);
                });
              }}
            ></div>
          ): null;

          let left_children = (typeof s.ctrl &&
            typeof s.ctrl.left != "undefined" &&
            typeof s.ctrl.left.children != "undefined") ? s.ctrl.left.children : null;
          let right_children = (typeof s.ctrl &&
            typeof s.ctrl.right != "undefined" &&
            typeof s.ctrl.right.children != "undefined") ? s.ctrl.right.children : null;

          // if add_options is true create a left and right optional btn space for additonal ctrls
          let snap_ctrls = add_options ? (
                <div className={`${class_maker({prefix, name, main: "snap_ctrls", iUN})} ${ctrl_cont_class}`} {...ctrl_cont_style} >
                  <div className={`${class_maker({prefix, name, main: "snap_ctrls_left", iUN})}`}>
                    {left_children}
                  </div>
                  <div className={`${class_maker({prefix, name, main: "snap_ctrls_main", iUN})} ${ctrl_main_class}  ${this.snap_ctrls_main_orient.current || ""}`} ref={this.snap_ctrls_main} >
                    {snap_btns}
                  </div>
                  <div className={`${class_maker({prefix, name, main: "snap_ctrls_right", iUN})}`}>
                    {right_children}
                    {dyn_ctrls}
                  </div>
                </div>
              ) : (
                <div className={`${class_maker({prefix, name, main: "snap_ctrls", iUN})}`} {...ctrl_cont_style} >
                  {snap_btns}
                </div>
              );

          let top_ctrls,
          bottom_ctrls;

          switch (ctrl_align) {
            case "bottom": /*this one needs to be standard - remove the others*/
            case "low":
            case "lower":
            case "down":
            case "under":
              bottom_ctrls = snap_ctrls;
              top_ctrls = null;
              break;
            // case "export":
            //   top_ctrls = (
            //     <Exporter home={export_class}>
            //       {snap_ctrls}
            //     </Exporter>
            //   );
            //   break;
            default:
              // otherwise default to top controls
              top_ctrls = snap_ctrls;
              bottom_ctrls = null;
          }

          // where not going to do align = "export" anymore - align = "bottom" and export.filter = ["bottom"] to export the bottom ctrls
          if (export_obj != "" && (typeof export_obj.filter == "undefined" || export_obj.filter.includes(ctrl_align))) {
            bottom_ctrls = null;
            top_ctrls = (
              <Exporter home={export_class}>
                {snap_ctrls}
              </Exporter>
            );
          }



        // snap content sections
        let section_labels = (labels[0] != "default") ? labels : icons;

        //hide if: no children, has once child && one label
        let hide_ctrls = (
          typeof myProps.children == "undefined" ||
          isNaN(myProps.children.length) && section_labels.length < 2 ) ? true : false;

        /* SECTION ELEMENTS */

        let snap_sections = child_array.reduce((result, child_node, ndx) => {

          let show_class = (ndx == 0) ? "show" : "";

          // let child_node = (typeof myProps.children == "undefined" || isNaN(myProps.children.length) && ndx > 0) ? "" :
          // (isNaN(myProps.children.length) && ndx == 0) ? myProps.children :  myProps.children[ndx];

          let icon_str = child_node.props.label//section_labels[ndx];
          // let s_class = (exists(s.extras) && Array.isArray(s.extras) && exists(s.extras[ndx]) && exists(s.extras[ndx].section_class)) ? s.extras[ndx].section_class :
          // (exists(s.extras) && Array.isArray(s.extras) && exists(s.extras[0]) && exists(s.extras[0].section_class)) ? s.extras[0].section_class :
          // (exists(s.extras) && exists(s.extras.section_class)) ? s.extras.section_class : "";
          let cP = child_node.props;
          let s_class = (obj_exists(cP.extra,"section_class")) ? cP.extra.section_class  : "";
          // sample extras - snap_data.extras[0] = {section_class:'hide-scroll'}

          result.push(<div className={
            `${class_maker({ prefix, name, main: "snap_section", iUN, ndx })} ${icon_str ? `${icon_str}_section` : ""}
            ${icon_str ? `${icon_str}` : ""} ${mode} ${show_class} ${scroll_hider} ${s_class} hide-scroll`}
            key={`snap_section_${iUN}_${ndx}`}
            {...{"data-index":ndx, "data-iun":iUN}}
            >{child_node}</div>);

          return result;

        },[]);

        let dynamic_class = (orientation_ctrls == true) ? `orientation_ctrls ${ctrl_align}` : "";

        return (
          <div className={`${class_maker({prefix, name, main: "snapBox", iUN})} ${dynamic_class} ${tag}`} data-comp={`Snapper`}>
            { snap_head }
            { hide_ctrls ? null : top_ctrls }
            <div className={`${class_maker({prefix, name, main: "snap_cont", iUN})} ${mode}`} onScroll={ this.active_section.bind(this) } >
              {snap_sections}
            </div>
            {bottom_ctrls}
          </div>
        );
      }else {
        return null;
      }// end else myprops
    }// render
  }// class Snapper

  /*
    <div id={`${name}_TDTag_${iUN}`}
    className={custom_class} onClick={this.share_me.bind(this,s)}>
    </div>
  */

  /*
    // example of externally modifying snappers state using a reference
    paperStore.references[active_id].snap.current.setState({force_scroll: true, force_section: 1});
    paperStore.references[active_id].init = true;
    paperStore.removeRef(active_id);
  */

  /*
    to preserve 'this' use:
    onScroll={(e) => { this.active_section(e); }}
    not
    onScroll={ this.active_section }

    otherwise i have to bind this
    onScroll={ this.active_section.bind(this) }
    which still preserves the event
  */

    /**
     let snap_data = {
        name:"details_snap",
        // icons:["link", "share", "link"],
        iUN,
        //hide: true,
        mode:"scroll",
        // scroll: "hide",
        // section_callout: update_section,
        section_callback: update_section,
        start_ndx: 2,// paper.goto_section also controls the current section through force_scroll | this does very little if anything at all
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


      
    return (
        <Modal data={modal_data}>
          <Snapper ref={snapper_ref} data={ snap_data }>
          {all_views}
          </Snapper>
        </Modal>
      );
     */