import {useRef, useEffect, useState} from 'react';
import ProfileIcon from '../ProfileIcon';

import { exists, obj_exists } from '../../tools/exists';

const ImagePreview = (props) => {

  const {
    name,
    onChange
  } = props;

  const form_data = props.form;
  const { register, getValues, setValue } = form_data;

  const image_input_ref = useRef();
  const refresh_url = useRef(false);

  const [image, setImage] = useState(props.image || "");
  const [empty_link, setEmpty] = useState(exists(props.image) ? true : false);

  const prep_preview = async (e, rf) => {

    // setValue("url_data","what");
    // DOCS: i use this to set state url_data which triggers a reaction in the above useEffect fn
    // which calls process_preview below

    let my_vals = getValues();// ok this works
    console.log(`[prep_preview] im here`, my_vals);

    let values = getValues();

    let targetValue = values[`${name}`];
    let new_value;

    refresh_url.current = (typeof rf != "undefined") ? rf : false;


    let find_url = linkify.find(targetValue);
    // http://youtu.be/9cdUxZuarL0
    // what about a string with initial text and a url http://youtu.be/9cdUxZuarL0
    // what about a string with initial text and a url http://youtu.be/9cdUxZuarL0 what about trailing space?

    let url_value = Array.isArray(find_url) && obj_exists(find_url[0], "href") ? find_url[0].href : "";

    if (url_value.includes("http") && !url_value.includes("https")) {
      new_value = url_value.replace("http", "https");
    } else {
      new_value = url_value;
    }

    let is_pdf = new_value.includes(".pdf");

    if (new_value != "" /*&& !is_pdf*/) {
      // FormStore.setData("url_data",new_value);
      // if(onChange){
      //   onChange({e, name});
      // }else{
      //   setImage(new_value);
      // }// else
      // image_input_ref.current.value = new_value;
      // GOTCHA: set here and there is no way to erase the input value by deleting it
      setEmpty(false);
    } else {
      // do nothing
      setEmpty(true);
    }// else

    if (onChange) {
      onChange({ e, name });
    } else {
      setImage(new_value);
    }// else
    image_input_ref.current.value = new_value;

  }// prep_preview

  const attrib = {};
  // if (onChange) attrib.onChange = (e) => {
  //   onChange({ e, name })
  // };
  let my_image = onChange ? props.image : image;

  if (onChange) {
    attrib.value = unescape(my_image);
  } else {
    attrib.defaultValue = unescape(my_image);
  }


  return (
    <>
      <div className={`dataInp_TCasing TCasing arc_input db_input borderline `} >
        <label className={`dataInp_TLabel TLabel arc_input db_input borderline`}>Image Url?</label>
        <div className={`dataInp_TCont TCont arc_input db_input borderline`} >
        <input id="dataInp_TInput" className={`dataInp_TInput TInput arc_input db_input borderline form-control`} 
        type="text" 
        name={name}
          ref={(ref) => {
            image_input_ref.current = ref;
            register(ref);
          }}
          onChange={(e) => {
            prep_preview(e, true);
          }}
          onFocus={(e) => {
            e.preventDefault();
            e.target.select();
          }}
          {...attrib}
        />
        </div>
      </div>
      <div className={`pTree_image_preview_cont`}>
        {/*!empty_link &&*/ exists(my_image) ? <ProfileIcon {...{ name: "pTree_image", no_class: true, image: my_image }} /> : null}
      </div> 
    </>
  )
}

export default ImagePreview

//: onchange? props.image: image