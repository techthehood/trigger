// const prepSearchParty = require('./bookmark/prep_search_party.js');
  import /*React,*/ {useState, useRef, useEffect, forwardRef} from 'react';
  import { useForm, ErrorMessage } from 'react-hook-form';
  import {isAlpha, isAlphanumeric} from 'validator';//https://www.npmjs.com/package/validator
  // import ListBookmarks from '../ListBookmarks';
  // import IconWall from '../IconWall/IconWall';
  import Filter from '../Filter';
  import VIScroll from '../VirtualScroll/Views';
  import Exporter from '../Exporter';
  import { obj_exists } from '../../tools/exists';
  // import MakeBookmarks from '../MakeBookmarks';

  // const {mc_search} = require('../../mc_search.js');
  // const {re_search} = require('../../re_search.js');
  // const {wrapr} = require('../../tools/wrapr');
  // const {exists, obj_exists} = require('../../tools/exists');
  // const {my_storage} = require('../../my_storage');
  // const {types} = require('../../tools/types');
  // const {useStorage} = require('../useStorage');
  // const {load_bookmark} = require('../../load_bookmark.js');
  // const {hold_me} = require('../hold_me');
  // const {delete_bookmark} = require('../../delete_bookmark');

  require('./SearchParty.scss');


  const SearchParty = forwardRef((props, ref) => {
    // e,eID,prefix,sta
    // let search_page = document.getElementById(eID);
    // NOW: search bkmks in sessionStorage will probably need to be host_id specific somehow
    let {
      list,
      items,
      prefix = "",
      visible = false,// LATER: i need visible to be used on Filter
      search_display,
      row_more = false,
      reset_callback,
      render = "auto",
      path,
      task,
      payload,
      default_filters,
      // active_filters, use props.active_filters
      callback,
      overlay = false,// makes the drop down options overlay instead of increase the parent height
      input_ref = {},
      headless = false,
      export_options = false,
      export_home,
      input_name = `search_text`,
      list_src = "external",
      show_labels = true,
      mode,
      single_click = false,
    } = props;

    const iUN_ref = useRef(Math.round(Math.random() * 10000));
    let iUN = iUN_ref.current;

    const [val, setVal] = useState(0);
    const forceUpdate = () => {
      setVal(val => ++val); // update the state to force render
    }// forceUpdate

    const [init, setInit] = useState({start: false, ready: false});

    if(props.active_filters && !Array.isArray(props.active_filters)) throw "[search party] props.active_filter must be an array";

    const [active_filters, setActiveFilters] = useState( props.active_filters || [] );
    const [view_options, setView] = useState(visible);

    // deprecated - not really using searchText or setSearchText
    const [searchText, setSearchText] = useState("");// needs to come from a saved source
    const search_input = useRef();
    const search_ref = useRef();
    const vIS_ref = useRef();

    const { register, getValues, setValue, handleSubmit, watch, errors, formState, triggerValidation, reset } = useForm({ mode: "onchange", criteriaMode: "all", reValidateMode: "onChange"});// needed to trigger error on change
    const { dirty, isSubmitting, touched, submitCount, isValid } = formState;


    // now the form_data doesn't reset when forceUpdate is called
    let form_data_ref = useRef({register, getValues, setValue, errors, isValid, triggerValidation, reset});
    let form_data = form_data_ref.current;// reset/refresh fails if form_data isn't persisted using useRef

    if(ref == undefined) ref = {};
    ref.vIS_ref = vIS_ref;

    // GOTCHA - clash between persistent (useRef) form_data and updating form_data persistent doesn't clear isValid on unmounting
    // updating resets isValid with every rerender - i tapped into the control for Views auto render feature
    // let form_data = {register, getValues, setValue, errors, isValid, triggerValidation, reset};

    // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
    useEffect(() => {
      setInit( (prev) => {return {...prev, start: true};});

      // add_initial_text();

      return () => {
        form_data.reset();
      }
    },[]);

    useEffect(() => {
      if(init.start == true && init.ready == false){
        // console.warn("[SearchParty] setting init...");
        setInit((prev) =>{ return {...prev, ready: true};});
      }
    },[init]);

    let add_initial_text = async (txt) => {
      // let stored_session = await my_storage({request: "search"});
      //
      // if(exists(stored_session.bookmarks) && exists(stored_session.bookmarks.request)){
      //   form_data.setValue("search_text",stored_session.bookmarks.request);// i can set the value here
      //   form_data.triggerValidation();
      // }// if

      form_data.setValue(input_name, txt);// i can set the value here
      form_data.triggerValidation();

    }// add_initial_text

    ref.add_initial_text = add_initial_text;

    const validateSearchText = (value) => {
      // await sleep(1000);
      // let is_valid = isAlphanumeric(value);
      if(typeof value == "undefined") return true;

      let no_double_spaces = (value.indexOf("  ") == -1) ? true : false;

      const valNoSpaces = value.split(' ').join('');// fix for validator not accepting spaces
      let is_valid = (isAlphanumeric(valNoSpaces) && no_double_spaces);

      // let is_valid = value.split(" ").every( str => isAlphanumeric(str) );
      // does work for double spaces. but prematurely alerts for single spaces also

      return (is_valid) ? true : "restricted characters";
    }// validateSearchText

    const update_text = () => {
      // deprecated - not really using update_text
      console.log("[title] getValues", form_data.getValues());
      let {search_text} = form_data.getValues();
      setSearchText(search_text);
    }

    const find_it = (obj) => {
      // e.persist();
      console.warn(`[SearchParty] vIS_ref`,vIS_ref);
      if(!obj_exists(form_data,"errors.search_text") && form_data.isValid){
        console.log(`[SearchParty] isValid`, isValid);
        //this errors.search_text test works
        if(callback) callback({form_data, active_filters, forceUpdate, ...obj});
        setView(false);
        // .then(() => {
        //   // update_text();
        // });
      }
      return Promise.resolve();
    }// find_it

    const reset_list = () => {
      if(reset_callback){
        reset_callback({form_data, active_filters, forceUpdate}).then(() => {
          find_it();
        });
      }//if
    }// reset_list

    const iconWall_callback = (e, obj) => {
      console.warn("[SearchParty] iconwall obj", obj);

      setActiveFilters(obj.active_options);

      // if(obj.close) obj.close();// non longer needs to close
    }// iconWall_callback

    const export_active_filters = ({value, ancestor}) => {
      setActiveFilters(value);
    };

    let option_icon = (active_filters.length != 0) ? `${active_filters[0]} heartbeat` : "options";

    let search_vSData = /*storage_target ?*/  {
      ref: vIS_ref,
      // store,
      // payload,
      // upload:{feed_ids:section.feed_ids},
      // path,
      // task: alt_task,
      // visible: (mode  == modes[1]) ? true : false,// dynamic with mode value
      // track_position: true,
      // project_id: pref_data.project_id,
      // host_id,
      // text_view,
      data: {
        callback: find_it,
        childHeight: 43,
        home:`search_display_${iUN}`,
        iUN: iUN,
        main_loader: false,
        scroll_loader: true,
        // callback:fetch_info,
        render,
        // setList: setFeeds,
        reset_list,
        list_display: search_display,
        list_src,
        internal_tracking:false,
        // flip: true
        // height_calc,
        // dynamic_height: feeds.height
      }
    } /*: {}// search_vSData*/



    if(list){
      search_vSData.data.list = list;
      search_vSData.data.items = items;
    }

    if(props.project_id) search_vSData.project_id = props.project_id;
    if(path) search_vSData.path = path;
    if(task) search_vSData.task = task;
    if(payload) search_vSData.payload = payload;

    // if row_more is false it won't show up, but everyy scroll data has one
    if(row_more) search_vSData.data.has_more = row_more;

    let filter_data = {
      ...props,
      // ancestor,
      static_view: true,
      default_active_filters: default_filters,
      // filter_value: exists(stored_session,"bookmarks.request") ? stored_session.bookmarks.request : "",
      filter_value: "",// i may not have to set it here (use add_initial_text)
      active_filters,
      search_callback: find_it,
      export_active_filters,// what does this button do?
      // filter_scope: store.filter_scope,
      input_title: `Message title`,
      placeholder: `Enter search request`,
      register: form_data.register,
      input_name,
      ref: input_ref,
      ref_data: {/*required: true,*/ validate: validateSearchText, maxLength:`40`},
      show_labels,
      mode,
      single_click,
    };// filter_data

    let content_section = (
      <div className={`${prefix}search_display search_display_${iUN} search_display hide-scroll`}>
        {
          init.start && init.ready /*&& storage_target*/ ?
          /*
          <ListBookmarks mode={"search"} modal={modal} data={{prefix, state}} />
          */
          <VIScroll {...search_vSData}/>
          : null
        }
      </div>);

    let display_content = !export_options ? (
      <>
        {content_section}
      </>
    ) : (
      <Exporter data={{home: export_home, delay: 1}} key={`feat_exporter_${iUN}`}>
        {content_section}
      </Exporter>
    );

    let search_content = headless ? (
      <>
        <Filter {...filter_data}/>
        {display_content}
      </>
    ) : (
      <>
          <div className={`${prefix}search_cont search_cont ${overlay ? "overlay" : ""}`} data-comp={`SearchParty`} >
          <label className={`${prefix}search_label_${iUN} ${prefix}search_label search_label`}
            title={`Message title`} >
            Search your media:
          </label>
          <Filter {...filter_data}/>
          <div className={`${prefix}search_log search_log word_wrap`}></div>
        </div>
        {display_content}
      </>
    )

    return (
      <>
      {search_content}
      </>
    );

  })//end PrepSearchParty

export default SearchParty;

// let search_obj = {
//   ref: sp_ref.current,
//   input_ref: search_ref.current,
//   callback: find_it,
//   reset_callback: reset_list,
//   search_display,
//   list_src: "internal",
//   task: `searchSponsors`,//`getBookmarks`,
//   path: `api/trigger/user`,
//   project_id: sponsor_id,
//   payload: "bookmarks",
//   // list: search_data.list,
//   // items: search_data.items,
//   render: "none",
//   default_filters: filter_values,
//   headless: true,
//   static_view: true,
//   icons_top: true,
//   // export_options: true,
//   // export_home: `feat_search_content_${iUN}`,
// };