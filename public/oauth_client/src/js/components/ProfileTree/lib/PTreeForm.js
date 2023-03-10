import {forwardRef, useEffect, useState} from 'react'
import CustomInput from '../../CustomInput'
import RawHide from '../../RawHide';
import CustomTextarea from '../../CustomTextarea'
import LinkPreview from '../../LinkPreview/LinkPreview';
import { obj_exists } from '../../../tools/exists';
import ImagePreview from '../../ImagePreview';

const PTreeForm = forwardRef((props, ref) => {

  const {
    form_data,
    label,
    id = Date.now(),
  } = props

  const {register, handleSubmit, errors} = form_data;
  const [item_data, setItemData] = useState({
    id,
    title: props.title || "",// faker.internet.email()
    description: props.description || "",
    image: props.image || "",
    link: props.link || "",
  });
  
  const [title_error, setTitleError] = useState({ error: false, message: "" });

  ref.current.setTitleError = setTitleError;

  const onSubmit = () => {
    
  }// onSubmit

  const updateInput = (uI) => {
    let {name} = uI;
    let values = form_data.getValues();
    // debugger;

    if (name == "title"){ 
      if (values[name] == ""){
        setTitleError({ error: true, message: "value is required" })
      }else{
        setTitleError({ error: false, message: ""})
      }
    }

    setItemData((prev) => {
      let item_update = {...prev};
      item_update[`${name}`] = values[name];
      return item_update;
    });
  }// updateInput

  const process_meta = (obj) => {
    let values = form_data.getValues();
    let {
      title,
      description,
      image
    } = obj;

    let meta_updates = {};

    let input_labels = Object.keys(values);
    input_labels.forEach((entry) => {
      if (values[`${entry}`] == "" && obj_exists(obj, `${entry}`)) meta_updates[`${entry}`] = obj[`${entry}`];
    });

    if(Object.keys(meta_updates).length == 0) return;

    setItemData((prev) => {
      let item_update = { ...prev, ...meta_updates};
      return item_update;
    });

  }// process_meta

  let title_data = {};
  title_data.value = item_data.title;
  title_data.reg_data = {required: true};

  let pass_data = {};
  pass_data.value = faker.random.uuid();

  let desc_data = {};
  desc_data.value = item_data.description;

  return (
    <div className="pTree_form_wrapper">
      <label className={`pTree_form_title_label`}>
        {label}
      </label>
      {/* <div className={`pTree_form_form`}> */}
        <form className={`pTree_form hide-scroll`} onSubmit={handleSubmit(onSubmit)}>
          <fieldset>
            <CustomInput
              name="title"
              type="text"
              id="title"
              label="Add a link title"
              placeholder="Enter title text..."
              onChange={updateInput}
              // {...register("email")}
              register={register}
              {...title_data}
            />
          </fieldset>
          { title_error.error ? (
          <p className={`title_error`}>{title_error.message}</p>
          ) : null}
          <fieldset>
            <RawHide {...{title:"more options",hr:true, top_hr:true, custom:"form_description_menu form_quick_menu", icon_up:"options", icon_down:"options", disc: false}}>
              {/*<RawHide {...{title:"description",hr:true, top_hr:true, custom:"form_description_menu form_quick_menu"}}>*/}
              <CustomTextarea
                name="description"
                type="text"
                id="description"
                label="link description"
                placeholder="Enter your link description text..."
                onChange={updateInput}
                register={register}
                {...desc_data}
              />
            </RawHide>
          </fieldset>
          <fieldset>
          <RawHide {...{ title: "add an image", hr: true, is_open: false,/*top_hr:true,*/ custom: "form_link_menu form_quick_menu", icon_up: "options", icon_down: "options", disc: false }}>
            <ImagePreview {...{ form: form_data, image: item_data.image, name: "image", onChange: updateInput}} />
          </RawHide>
          </fieldset>
          <fieldset>
          <RawHide {...{ title: "add a link", hr: true, is_open: true,/*top_hr:true,*/ custom: "form_link_menu form_quick_menu", icon_down: "link", disc: false }}>
            <LinkPreview {...{ data: { form: form_data }, url: item_data.link, callback: process_meta, name: "link"}} />
            </RawHide>
          </fieldset>
          <fieldset>
            <input type="hidden" name="id" ref={register} value={id} />
          </fieldset>
          {/* {this.passportStore.state.errorMessage ?
            <div className="alert alert-danger">
              {this.passportStore.state.errorMessage}
            </div>
            : null} */}

          {/* <button type="submit" className="btn btn-primary" >Sign Up</button> */}
        </form>
      {/* </div> */}
    </div>
  )
})// pTreeForm

export default PTreeForm
