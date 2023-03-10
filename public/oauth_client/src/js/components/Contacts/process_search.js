// const makecontacts = require('./make_contacts.js');
// const {load_bookmark} = require('./load_bookmark.js');
// // import Listcontacts from './components/Listcontacts';


  export const process_search = async function(rObj)
  {
    if(rObj == "" || rObj == []) return;
    let result_obj = (typeof rObj.result == "string") ? JSON.parse(rObj.result) : rObj.result;

    // debugger;
    
    const {
      state,
      prefix = "arc_",// deprecated
      value = "",// will be undefined if no search text
      modal,
      parentUpdate,
      active_filters,
      type,
    } = rObj;
    
    // let orient = (prefix == "arc" || prefix == "arc_") ? "main" : "alt";//bugfix for alt issue - orient set to main in make_bookmark
    
    // let srch_obj = {request:value,search:result_obj};
    // state.contacts = srch_obj;
    state.update_contacts({result_obj, type, active_filters})



    // return;
    
      if(parentUpdate) parentUpdate();
      // i may not need to update parent here, the list is updated in an observed store
      // and should trigger a re-render


  }//end process_search
