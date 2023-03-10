import {useState, useRef} from 'react';
require('./RawHide.scss');

const RawHide = ({
  show: always_open = false,// setting for always open
  children,
  title,
  iconClass = "",
  custom: custom_class = "",
  hr = true,
  top_hr = false,
  show_ctrl = true,
  icon,
  icon_up = "circle-up",
  icon_down = "circle-down",
  disc = true,
  has_display = true,// turn to false to force 1st child display to the content area when no title is given
  is_open = false,
  // encased = true
}) => {

  let always_visible = useRef(always_open);
  const [rawDrop, setRawDrop] = useState(is_open ? true : false);

  const toggle_dropdown = () => {
    // desc_init.current = true;// initial display showed the desc_cont collapsing - i need it to start hidden
    setRawDrop(!rawDrop);
  }

  let animate_class = (always_visible.current == true) ? "" : (rawDrop) ? "stretch" : "squish";
  let mode = rawDrop ? "show" : "hide";
  let drop_icon = (icon) ? icon : (rawDrop) ? icon_up : icon_down;

  let t_hr = top_hr ? (<hr/>) : null;
  let sh_hr = hr ? (<hr/>) : null;
  let sh_disc = disc ? "d3-disc-outer" : "";

  let first_child, rest;

  if (!title && has_display) {
    if(Array.isArray(children)){
      [first_child,...rest] = children;
    }else {
      // sometimes children is just a single object - if so and there is no title, display the child
      first_child = children;
      // if this is the case, don't show a btn
      show_ctrl = false;
      always_visible.current = true;
    }
  }else{
    rest = children;
  }

  let head_contents = (!title) ? first_child : <label >{title}</label>;
  return (
    <div className={`rawDrop_wrapper ${custom_class}`} data-comp={`RawHide`} >
      {t_hr}
      <div className={`rawDrop_header`}>
        {head_contents}
        {always_visible.current == false ? (
            <div className={`rawDrop_dropdown_icon d3-ico icon-${drop_icon} ${sh_disc} ${iconClass}`}
            onClick={toggle_dropdown}
            title={`${mode}`}
            ></div>
          ) : null
        }
      </div>
      <div className={`rawDrop_display_cont ${animate_class}`} >
        {rest}
      </div>
      {sh_hr}
    </div>
  )
}

export default RawHide;
