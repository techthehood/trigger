import {useState, useEffect, useRef} from 'react';
import { observer } from 'mobx-react';
const {my_storage} = require('../my_storage');
const {default_prefs, default_pref_obj, state_values} = require('./settings');
import MiniForm from '../elements/MiniForm';
import RawHide from '../elements/RawHide';
import { obj_exists } from '../tools/exists';
const {getIUN} = require('../tools/randomizer');
const {warn_modal} = require('../tools/warn_modal');
const {is_object} = require('../tools/is_object');

const display_console = false;

  const useStorage = () => {
    // why useStorage? i needed a way to async/await get the my_storage values
    // i still can't tell why

    // maybe because of this setter below (setStorageTarget) i need to set the state and trigger a re-render
    // it looks like the only benefit is that i could outsource the prep of certain vars and bring back the vars
    // in already in the form i needed them to be in (without being objects to process with object notation)
    // nope. still don't know. maybe it was an experiment
    const [viewer_prefs, setViewerPrefs] = useState({});

    useEffect(() => {
        if(display_console || true) console.warn(`[useStorage] rendering...`);
        get_storage();
    },[]);

    const get_storage = async () => {
      let get_prefs = await my_storage({request:"user_prefs"});

      let me_seeks = "im here";

      setViewerPrefs({...get_prefs});
      return;
    }

    return [viewer_prefs];

  }// useStorage




  const Dash_set = observer(({
    state,
    viewer,
  }) => {

    const iUN_ref = useRef(getIUN());
    const iUN = iUN_ref.current;

    let [viewer_prefs] = useStorage();


    if(!is_object(viewer_prefs,false)) return null;

    const update_storage = (obj) => {
      let {property, value, storage, update} = obj;
      
      switch (storage) {
        case "demo":
          update(obj);
          break;

        case "active_demo":
          update({active:value});
          break;

          default:
          update = {};// NOTE: this will overwrite the update callback if its set on user_prefs
          update[`${property}`] = value;
          my_storage({ request: storage, update });// "user_prefs"
          break;
      }

      if (property == "auto_editor"){
        // refresh the page - can i prompt?
        if(value == true){
          let msg = `auto editor changes will take effect after the page reloads.`;
          warn_modal({msg, callback: reload_me, go_text: "Reload", cancel_text: "Later",modal_wrap_tag:"dash",hasWrapper:true});
        }
      }// if

      if(state_values.includes(property) /*&& state[`${obj.property}`]*/){
        // if its one of my active state values do this
        state[`${property}`] = value;
      }// state_values

    }// update_storage

    const reload_me = () => {
      location.replace(location.href);
    }// reload_me

    // using default_prefs makes sure all possible value categories are represented - present in storage or not
    let sub_groups = {};
    let mini_forms = default_prefs.reduce((results, pref, ndx) => {
      let pref_obj = {...default_pref_obj[`${pref}`]};

      switch (pref_obj.storage) {
        case "demo":
            pref_obj.value = obj_exists(VIEWER_DATA, "DEMO.show") ? VIEWER_DATA.DEMO.show : pref_obj.value;
          break;
        case "active_demo":
            pref_obj.value = obj_exists(VIEWER_DATA, "DEMO.active") ? VIEWER_DATA.DEMO.active : pref_obj.value;
          break;
      
        default:
          // use the viewer_prefs if available
          if (obj_exists(state, `${pref}`, true) && state.populated == true){
            // only use if populated values are set
            pref_obj.value = state[`${pref}`]
          } else if (pref_obj.storage == "user_prefs" && obj_exists(viewer_prefs,`${pref}`, true) && viewer_prefs[`${pref}`] !== ""){
            // this changes the value to the current setting if it exists
            pref_obj.value = viewer_prefs[`${pref}`];
          }// else if
          break;
      }
      
      // otherwise use the default
      pref_obj.callback = update_storage;

      // update or don't based on criteria
      if(typeof pref_obj.group != "undefined"){
        // check to see if property exists
        if (!obj_exists(sub_groups, `${pref_obj.group.title}`)){
          // if not exists create an array
          sub_groups[`${pref_obj.group.title}`] = [];
        }// if

        sub_groups[`${pref_obj.group.title}`].push(<MiniForm key={`miniform_${iUN}_${ndx}`} {...{ ...pref_obj }} />)
      }else{
        results.push(<MiniForm key={`miniform_${iUN}_${ndx}`} {...{ ...pref_obj }} />)
      }// else

      return results
    },[]);

    // let show_hide_data = {title:"settings",hr:false}
    // <RawHide {...show_hide_data}>
    // </RawHide>

    // see if sub_groups has properties
    let sub_keys = Object.keys(sub_groups);
    if(sub_keys.length > 0){
      let sub_group_collections = sub_keys.map((key, ndx) => {
        let show_hide_data = { title: `${key}`, custom: "raw_dash", hr: true, key: `miniform_rawhide_${iUN}_${ndx}`}
        if(ndx == sub_keys.length - 1) show_hide_data.hr = false;
        return (
          <RawHide {...show_hide_data}>
            {sub_groups[`${key}`]}
          </RawHide>
        )
      });

      mini_forms.push(sub_group_collections);
    }//if

    return (
      <div className={`dashboard_settings hide-scroll`} data-comp={`Dash_set`} >
          {mini_forms}
      </div>
    )
  });

  export default Dash_set;
