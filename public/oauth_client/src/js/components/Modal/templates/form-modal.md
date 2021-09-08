

```
    import {useState, useRef, useEffect} from 'react';
    import { useForm, ErrorMessage } from 'react-hook-form';
    import {isAlpha, isAlphanumeric} from 'validator';//https://www.npmjs.com/package/validator

    import Modal from '../../../elements/Modal/Modal';
    const {exists} = require('../../../tools/exists'); 


    export const FlavorForm = ({data}) => {

      const iUN_ref = useRef(Math.round(Math.random() * 10000));//props.iUN || Math.round(Math.random() * 10000)
      let iUN = iUN_ref.current;

      let {state, mode, prefix = ""} = data;


      const { register, getValues, setValue, handleSubmit, watch, errors, formState } = useForm({mode:"onchange"});// needed to trigger error on change
      const { dirty, isSubmitting, touched, submitCount, isValid } = formState;

      const init_text = (mode == "edit") ? state.userStorage.bookmarks.favorites.active : "";
      const init_icon = (mode == "edit") ? state.userStorage.bookmarks.favorites[`${state.userStorage.bookmarks.favorites.active}`].icon : "heart"
      const [flavor_text, setFlavorText] = useState(init_text);

      const update_text = (e) => {
        // optional - not really neccessary
        console.log("[title] getValues", getValues());
        // let {title_data = ""} = getValues();// im not using setValues but it lets me get the value from the input element
        let value_obj = getValues();
        let title_data = value_obj[`flavor_text_${iUN}`];// fix for using multiple inputs for the same field values
        // FormStore.setData("title_data",input_el.current.value);
        // FormStore.setData("title_data",title_data);
        let prep_text = escape(title_data);
        setFlavorText(prep_text);
      }//update_text

      const update_favorites = (e,obj) => {
        if(!errors[`flavor_text_${iUN}`] && isValid){
        //do something
        console.warn(`[FlavorForm] now updating favorites`);
        obj.close();
        }
      }

      const close_section_selector = (e,obj) => {
        // optional: modal can close itself

  			// closing chk does a regular close
  			obj.close();
    	}//close_section_selector

      const validateSearchText = (value) => {
        // this function won't trigger unless you add options to useForm i.e useForm({mode:"onchange"});
        // await sleep(1000);
        // let is_valid = isAlphanumeric(value);
        let no_double_spaces = (value.indexOf("  ") == -1) ? true : false;

        const valNoSpaces = value.split(' ').join('');// fix for validator not accepting spaces
        let is_valid = (isAlphanumeric(valNoSpaces) && no_double_spaces);

        return (is_valid) ? true : "restricted characters";
      }// validateSearchText

      let modal_name = `${prefix}flavor`;

      let modal_data = {
        name: modal_name,
        tag: "core",
        hasWrapper: true,
        content:{
          addClass:"hide-scroll"
        },
        go:{
          show: true,
          callback: update_favorites,
        },
        close:{
          show: true,
          callback: close_section_selector
        },
        cancel:{
          show: true,
          callback: close_section_selector
        }
      }// modal_data

      let mode_text = (mode == "edit") ? "edit" : "add new";

      let flavor_inner = (
        <div className="flavor_inner">
          <label>{mode_text} favorites title:</label>
          <input ref={register({required: true, validate: validateSearchText})}
          className={`flavor_input arc_info_type TInput borderline`} name={`flavor_text_${iUN}`}
          // onChange={update_text}
          placeholder={`Enter favorites title`}
          defaultValue={unescape(flavor_text)}
          onFocus={(e) => {
            e.preventDefault();
            e.target.select();
          }}
          />
          <ErrorMessage errors={errors} name={`flavor_text_${iUN}`}>
            {({ message }) => (exists(message)) ? (<p>{message}</p>) : null}
          </ErrorMessage>
        </div>
      )


      return (
        <Modal data={modal_data}>
          {flavor_inner}
        </Modal>
      );

    }// FlavorForm

    export default FlavorForm;

```
