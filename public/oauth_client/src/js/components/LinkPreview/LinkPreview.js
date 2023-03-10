  import React, { useEffect, useState, useContext, Fragment, useRef } from 'react';
  import { useForm } from 'react-hook-form';
  import { observer, inject } from "mobx-react";

  // import {FormContext} from '../../formContext';
  import SimpleTree from '../ProfileTree/lib/SimpleTree';

  import PreviewUrl from '../PreviewUrl/PreviewUrl';
  import { obj_exists } from '../../tools/exists';


  // const {display_preview_url, display_preview_picture} = require('../../../tools/rich_preview');
  const {rich_parser} = require('../../tools/rich_parser.js');
  const {wait_a_second} = require('../../tools/waiter');
  const {prep_text} =  require('../../tools/prep_text.js');

  require('./LinkPreview.scss');

  const display_console = false;

  const LinkPreview = observer( (props) => {

    // NOTE: GOTCHA: escape and unescape was causing img urls to fail

    const FormStore = {};// useContext(FormContext);

    const {
      name,
      onChange
    } = props;

    const form_data = props.data.form;
    const { register, getValues, setValue } = form_data;
    let {item_data} = FormStore;
    // const { register, getValues, setValue, handleSubmit, watch, errors } = useForm();

    const [counter, setCount] = useState(0);
    const forceUpdate = () => { setCount(prev => ++prev); };// update the state to force render

    let has_preview_data = true;
    let show_preview = has_preview_data ? (
      "preview here"
    ) : null;

    // let input_el = useRef();// deprecated

    const refresh_url = useRef(false);
    const link_input_ref = useRef();

    const [show_image, setImage] = useState();
    const [empty_link, setEmpty] = useState(true);
    const [url, setUrl] = useState(props.url || "");
    const [meta_data, setMetaData] = useState("");

    let state = {};
    const [preview_url_data, setMRDD] = useState();
    const [title_data, setTitle] = useState();

    state.show_imge = show_image;
    state.setImge = setImage;

    useEffect(() => {
      prep_preview();
      return function cleanup() {
        console.log("[LinkPreview] prep_preview useEffect is unmounting");
      };
    },[])

    useEffect(() => {

      let cancel_obj = {};

      process_preview({cancel_obj});

      return () => {
        if (display_console || true) console.warn(`[LinkPreview] canceling token`);
        if (cancel_obj.cancelToken) cancel_obj.cancelToken.cancel('Operation canceled due to new request.');
        // console.warn(`cancelToken for ${search_value}`,cancel_obj.cancelToken);
      }// return
    },[url, counter])


    const prep_preview = async (rf, f = false) => {

      // setValue("url_data","what");
      // DOCS: i use this to set state url_data which triggers a reaction in the above useEffect fn
      // which calls process_preview below

      let my_vals = getValues();// ok this works
      console.log(`[prep_preview] im here`,my_vals);

      let values = getValues();

      let targetValue = values[`${name}`];
      let new_value;

      refresh_url.current = (typeof rf != "undefined") ? rf : false;


      let find_url = linkify.find(targetValue);
      // http://youtu.be/9cdUxZuarL0
      // what about a string with initial text and a url http://youtu.be/9cdUxZuarL0
      // what about a string with initial text and a url http://youtu.be/9cdUxZuarL0 what about trailing space?

      let url_value = Array.isArray(find_url) && obj_exists(find_url[0], "href") ? find_url[0].href : "";

      if(url_value.includes("http") && !url_value.includes("https"))
      {
        new_value = url_value.replace("http","https");
      }else {
        new_value = url_value;
      }

      let is_pdf = new_value.includes(".pdf");

      if (new_value != "" /*&& !is_pdf*/){
        // FormStore.setData("url_data",new_value);
        setUrl(new_value);
        link_input_ref.current.value = new_value;
        setEmpty(false);
      }else{
        // do nothing
        setEmpty(true);
      }// else

    }// prep_preview

    const process_preview = async ({cancel_obj}) => {

        let results = await rich_parser(url, cancel_obj);

        try {
          if(Object.keys(results).length > 0) setMetaData(results);
          if(props.callback) props.callback(results);
        } catch (error) {
          setMetaData({title:"no preview available"});
        }
    }// process_preview

    // ISSUE: preview_url_data is undefined
    /* NOTE: i may not be doing this */
    // let preview_url = (preview_url_data != undefined) ?  <PreviewUrl data={preview_url_data} /> : null;

    // if(typeof FormStore.item_data.url_data == "undefined"){
    //   FormStore.setData("url_data","");
    // }

    // if(typeof FormStore.item_data.meta_data == "undefined"){
    //   FormStore.setData("meta_data","");
    // }



        //save a version of the meta_data to a hidden input (should we use json or string?)
        // rich_hidden_meta.value = saveMetaValue(meta_data);// i need this but defined better

    return (
      <Fragment>
      <div className={`dataInp_TCasing TCasing arc_input db_input borderline `} >
        <label className={`dataInp_TLabel TLabel arc_input db_input borderline`}>Link Url?</label>
        <div className={`dataInp_TCont TCont arc_input db_input borderline`} >
          <input id="dataInp_TInput" className={`dataInp_TInput TInput arc_input db_input borderline form-control`} 
            type="text" 
            name={`${name}`}
            ref={(ref) => {
              link_input_ref.current = ref;
              register(ref);
            }}
            onChange={() => {
              prep_preview(true);
            }}
            onFocus={(e) => {
              e.preventDefault();
              e.target.select();
            }}
            defaultValue={unescape(url)}
          />
          <input id={`rich_hidden_meta`} className={`rich_hidden_meta`}
            type="hidden" name="meta_data"
            ref={register}
            value={meta_data}
          />
        </div>
      </div>
        {!empty_link ? <div className={`meta_preview info_booth`}>
          <div className={`previewBox_TDTag LBTag  previewBox `} >
            {/* {preview_url} NOTE: i may not be doing this */}
            {meta_data != "" ? <SimpleTree {...{item_data: {...meta_data}}} /> : null}
            <button id={`rich_refresh_btn`}
            className={`rich_refresh_btn icon-spinner11 d3-ico d3-disc d3-disc d3-disc-outer d3-disc-bg `}
            title="url preview"
            onClick={function(e)
            {
              e.preventDefault();
              // display_preview_url({store,"home":rich_home,"id":dpi_obj.id,"title_id":dpi_obj.title_id,"refresh":"true","tObj":trans_obj});
              // this is supposed to re-run the fn that requests the url data and updates the meta_data object with the results - triggers a render
              wait_a_second({action:"flash",seconds:1});
              // prep_preview(true);
              forceUpdate();
            }}></button>
          </div>
        </div> : null}
      </Fragment>
    )
  })

  export default LinkPreview
