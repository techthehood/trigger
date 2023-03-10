const clearMove = require('../attach_move/clear_move.js');
const formReset = require('../form/form_reset.js');
const {wait_a_second} = require('../tools/waiter.js');


const display_console = false;

const Dash_title = ({
  state,
  project_item
}) => {

  let {title_data} = project_item;

  // if im the editor and this is my project - there won't be a store2 and store (1) will be my current state

  // console.warn(`[Dash_title] project_item test`,project_item);// can i do both? no I can't // fail
  // ({title_data, _id}:project_item) // i tried to do this with props

  const post_upload = () => {
    if(display_console || true) console.warn(`[Dash_title] running post upload`);
    location.replace(location.href);
    wait_a_second({action:"hide"});
  }// post_upload

  const get_form = async () => {
    clearMove.clear_move({state});
    formReset.form_reset({state});

    const form = await import(/* webpackChunkName: "form" */ '../form/form.js');

    state.object_elements.trans_obj = {
      data:project_item,
      is_attach: false,
      mod: "edit",
      par_admin: false,
      post_upload,
      force_front: true,
      view: state.display_data//"group"
    };

    await form.get_info_form(state.object_elements.trans_obj,{state});

  }// get_form


  return (
    <div className={`dash_title_cont`} data-comp={`Dash_title`} >
      <div className={`dash_title clamp-1`}>{title_data}</div>
      <div className={`dash_form icon-pencil d3-ico d3-disc d3-disc-outer`}
      onClick={get_form}></div>
    </div>

  )
}

export default Dash_title;
