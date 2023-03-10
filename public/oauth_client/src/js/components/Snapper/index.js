
import React from 'react';//needed for React.Component
import Box from '../Box';
require('./snapper.scss');
const {bboy} = require('../../tools/stringMe.js');

export default class Snapper extends React.Component {

    constructor(props){
      super(props);
      this.state = {
        iUN:(props.iUN) ? props.iUN : Math.round(Math.random() * 10000)
      };
    }//

  componentDidMount = () => {
    console.log("[Snapper] component is ready to roll!");
    // console.log(`available data = ${this.props.data}`);

    // this.prep_vars(this.props.data);
  }//componentDidMount

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

  show_section = (e, targ, data) => {
    console.log("[show section running]");
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
        target.scrollIntoView({
          behavior: 'smooth'
        });
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
    }// swotcj
  }// show_section

  isScrolling;

  active_section = (e) => {
    e.preventDefault();
    let iUN = this.state.iUN;
    let scrollBox = e.target;

    //limit the scroll actions to this container
    if(scrollBox.classList.contains(`snap_cont_${iUN}`) == false){{return}}
    // Clear our timeout throughout the scroll
	   window.clearTimeout( this.isScrolling );
     let exists = this.exists;

	   // Set a timeout to run after scrolling ends
  	this.isScrolling = setTimeout(function() {

      let found_it = false;
  		// Run the callback
  		console.log( 'Scrolling has stopped.' );
      // console.log(`[scrollbox] scrollLeft`,scrollBox.scrollLeft);
      let scroll_edge = scrollBox.scrollLeft;
      // console.log(`[scrollbox] offsetWidth`,scrollBox.offsetWidth);
      let ctrls = scrollBox.childNodes;
      ctrls.forEach((item, ndx) => {
        // console.log(`[ctrl${ndx}] offsetLeft`,item.offsetLeft);
        // console.log(`[ctrl${ndx}] offsetWidth`,item.offsetWidth);
        // let item_edge = item.offsetLeft + item.offsetWidth;// right Edge
        let item_edge = item.offsetLeft + (item.offsetWidth * .75);// 3/4 Edge
        // console.log(`[ctrl${ndx}] item edge`,item_edge);
        let btn = document.querySelector(`.snap_btn_${iUN}_${ndx}`);

        if(found_it == false && item_edge > scroll_edge){
          found_it = true;
          // console.log(`[current itemt] = `,ndx
          if(exists(btn)){
            btn.classList.add("active");
          }
        }else{
          if(exists(btn)){
            btn.classList.remove("active");
          }
        }
      });

  	}, 66);
  }// active_section

  render(){
    let s = (typeof this.props.data != undefined) ? this.props.data : this.props,
    name = s.name,
    tag = s.tag || "",
    mode = s.mode || "scroll",/* tabs scroll*/
    icons = s.icons || ["default"],
    item_dots = {},
    iUN = this.state.iUN,
    device_type = s.device_type || "",
    custom = (s.custom) ? s.custom: `test_green ui-btn ui-icon-${icons[0]} ui-btn-icon-notext ui-shadow ui-corner-all ui-mini`,
    labels =  s.labels || ["default"],
    ctrl_align = (this.exists(s.ctrl) && this.exists(s.ctrl.align) ) ? s.ctrl.align : (this.exists(s.align)) ? s.align : "top",/* bottom, low, lower, down - anything else will be top */
    ctrl_item_style = {},
    ctrl_cont_style = {},
    ctrl_width = "30px",
    ctrl_tag = "",
    snap_btns = [],
    justify = s.justify || "dots",
    scroll_hider = (typeof s.scroll != "undefined" && s.scroll == "hide") ? "hide-scroll" : "";



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

      let item_default = {
        flex: `0 0 ${ctrl_width}`
      };

      // create a hypothetical margin
      let ctrl_margin = (typeof s.ctrl.margin != "undefined") ? {margin: s.ctrl.margin} : {};
      item_default = { ...item_default, ...ctrl_margin};

      // create a hypothetical padding
      let ctrl_padding = (typeof s.ctrl.padding != "undefined") ? {padding: s.ctrl.padding} : {};
      item_default = { ...item_default, ...ctrl_padding};


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

      let section_icons = (icons[0] != "default") ? icons : labels;
      snap_btns = icons.reduce((result, icon_str, ndx) => {

        let active = (ndx == 0 ) ? "active" : "";
        let custom = (justify != "dots") ?
        `snap_btn_${iUN} snap_btn_${iUN}_${ndx} ${icon_str}_icon ${device_type} snap_btn d3-ico d3-ico-btn icon-${icon_str} ${ctrl_tag} ${name} ${active}` :
        `snap_btn_${iUN} snap_btn_${iUN}_${ndx} ${device_type} snap_btn d3-ico d3-ico-btn ${ctrl_tag} ${justify} ${name} ${active}`;

        let data = {
          name:`${icon_str}_icon`,
          iUN:iUN,
          custom,
          style: ctrl_item_style,
          attributes:{
            "data-index": ndx,
            "data-iun":iUN
          },
          events:{
            onClick:{
              callout:this.show_section,
              data:[{iUN, index:ndx, mode}]
            }
          }
        }

        result.push(<Box key={`snap_ctrl_${iUN}_${ndx}`} data={data}/>);

        return result;
      },[]);

      let snap_ctrls = (
        <div className={`snap_ctrls_${iUN} snap_ctrls ${name}`} {...ctrl_cont_style} >
          {snap_btns}
        </div>
      );

      let top_ctrls,
      bottom_ctrls;

      switch (ctrl_align) {
        case "bottom":
        case "low":
        case "lower":
        case "down":
        case "under":
          bottom_ctrls = snap_ctrls;
          top_ctrls = null;
          break;
        default:
          // otherwise default to top controls
          top_ctrls = snap_ctrls;
          bottom_ctrls = null;
      }



    // snap content sections
    let section_labels = (labels[0] != "default") ? labels : icons;
    let myProps = this.props;

    //hide if: no children, has once child && one label
    let hide_ctrls = (
      typeof myProps.children == "undefined" ||
      isNaN(myProps.children.length) && section_labels.length < 2 ) ? true : false;

    let snap_sections = section_labels.reduce((result, icon_str, ndx) => {

      let show_class = (ndx == 0) ? "show" : "";

      let child_node = (typeof myProps.children == "undefined" || isNaN(myProps.children.length) && ndx > 0) ? "" : (isNaN(myProps.children.length) && ndx == 0) ? myProps.children :  myProps.children[ndx];

      result.push(<div className={
        `snap_section_${iUN}_${ndx} snap_section_${iUN} snap_section ${icon_str}_section
        ${icon_str} ${mode} ${show_class} ${scroll_hider} ${name}`}
        key={`snap_section_${iUN}_${ndx}`}
        {...{"data-index":ndx, "data-iun":iUN}}
        >{child_node}</div>);

      return result;

    },[]);

    return (
      <div className={`snapBox_${iUN} snapBox ${tag} ${name}`}>
        { hide_ctrls ? null : top_ctrls}
        <div className={`snap_cont_${iUN} snap_cont ${mode} ${name}`} onScroll={this.active_section}>
          {snap_sections}
        </div>
        {bottom_ctrls}
      </div>
    );

  }
}

/*
  <div id={`${name}_TDTag_${iUN}`}
  className={custom_class} onClick={this.share_me.bind(this,s)}>
  </div>
*/
