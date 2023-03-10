import {forwardRef, Suspense, useRef} from 'react';

import {get_template} from './lib/get_template';
import template_selector from './lib/temp_sel';
require("./MiniForm.scss");

const MiniForm = forwardRef((props, ref) => {

  let {
    form
  } = props;
  let template_name = get_template(form);
  let Data_form = template_selector[template_name];

  const data_ref = useRef();


  const update_value = (value) => {
    console.log(`[MiniForm] update_value is running!`);
    if(data_ref.current?.value){
      console.log(`[MiniForm] data_ref has a value!`);
    }

  }

  if(ref){
    ref.update_value = update_value;// this worked
  }

  return (
    // <div>{title}</div>
    <Suspense fallback={<div className="loader_modal w3-modal active"><div className="loader">Loading...</div></div>} >
      <Data_form ref={data_ref} {...{...props}}/>
    </Suspense>
  )
})

export default MiniForm;

// MiniForm properties
// {
//   title:"auto editor",
//   form:"toggle",
//   property:"auto_editor",
//   option_type: "boolean",
//   value:false,
//   callback:() => {},
//   description:"automatically updates your credentials to project editor on page load"
//   //doesn't need to be in settings
// }
