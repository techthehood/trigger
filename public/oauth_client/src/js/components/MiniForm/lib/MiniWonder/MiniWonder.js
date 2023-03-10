import { forwardRef } from "react";
import WonderBtn from "../../../WonderBtn";
require("./MiniWonder.scss");

const MiniWonder = forwardRef((props, ref) => {

  let {
    property,
    title,
    options,
    callback,
    default_value,
    value
  } = props;

  const update_wonders = (output) => {
    // this works
    console.warn(`[HoldNav] updating store`);
    // state.bkmk_btn_mode = output;
    callback({...props, property, value: output})
  }// update_wonders

  // main_transition: {
  //   title: "transition",
  //   form: "cycle",
  //   property: "main_transition",
  //   option_type: "string",
  //   options: {
  //     "left": { title: 'right', icon: 'icon-cirle-right' },
  //     "right": { title: 'bottom', icon: 'icon-cirle-bottom' },
  //     "bottom": { title: 'left', icon: 'icon-circle-left' },
  //   },
  //   value: "auto",
  //   callback: () => { },
  //   description: "determines how the main section btns transition to other sections."
  // },

  let wonder_btn_data = {
    name: `miniWonder`,
    common_class: "d3-ico d3-ico-btn",
    sections: options,
    hold_mode: true,
    default_section: props.value,
    src: "external",
    // section_name: value,// used with alt_default
    // alt_default: "hold",
    ms: 500,
    callback: update_wonders
  }// wonder_btn_data

  if(ref){
    wonder_btn_data.ref = ref;
  }

  return (
    <>
      <div className="miniForm_cont miniWonder_wrapper" data-comp="MiniWonder">
        <label className="miniWonder_title">{title}</label>
        <WonderBtn {...wonder_btn_data} />
      </div>
      <hr className={`miniForm_hr`}></hr>
    </>
  )
})

export default MiniWonder;