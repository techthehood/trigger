  const {fido} = require('../../tools/http.js');
  // const bookmark = require('./bookmark.js');
  const {process_search} = require('./process_search.js');
  const {wait_a_second} = require('../../tools/waiter');
  // const { my_storage } = require('../my_storage');
  const { obj_exists } = require('../../tools/exists');


  export const search_contacts = async function(e,eID,sObj)
  {
    //let srch_val = document.querySelector(".srchInp_TInput").value;
    let {
      state,
      prefix,
      form_data,
      modal,
      parentUpdate,
      active_filters,
      cancel_obj,
      force_init = false,
      limit = 10,
    } = sObj;
    let { search_text } = form_data.getValues();
    // let src_str = prefix + "srchInp";
    // let validity = state.object_elements [src_str].runDataCheck();
    if (!form_data.isValid) return;
    
    // this gets the current store state data and factors it into the request
    try {
      
      // my_storage({ request: "search", state }).then((state) => {

      // let srch_val = state.object_elements [src_str].getCurrentValue();
      let srch_val = active_filters[0];
      // let srchInp_ary = state.object_elements [src_str].get_event_ids();
      // let srchInp_id = srchInp_ary[0];

      let mode = (obj_exists(state,`contacts.${srch_val}`) && !force_init) ? "add" : "init";
      // LATER: add filter for folders, refine server search process (to broad & unorganized), maybe focus?
      let search_data = { text: srch_val, active_filters, limit};
      let has_scroll_data = obj_exists(state,`contacts.${srch_val}.scroll_data`);
      let scroll_data;
      if (has_scroll_data && mode == "add") {
        scroll_data = state.contacts[srch_val].scroll_data;
        search_data.scroll_data = scroll_data;
      }// if


      if (obj_exists(state, "contacts.scroll_data") && mode == "add") search_data.scroll_data = state.contacts.scroll_data;

      console.log("mc search running!");
      //print_to_log("search_log","log running!");
      // wait_a_second({action:"show"})
      // bookmark.print_to_log("search_log", "loading");

      // axios needs to send an object not just a string
      await fido({ state, path: "api/trigger/users", task: "searchContacts", data: search_data, cancel_obj })
        .then(async (result) => {
          console.log("return data = ", result);

          if (result.error) {
            console.warn(`[mc_search] result warning`, result)
            return;
          }
          //print the count to log
          //print_to_log("search_log","return data = " + htmlDecode(result));
          // let search_results = result.data;

          //pagination - send page
          return await process_search({ result, state, type: active_filters[0], active_filters, value: srch_val, prefix, modal, parentUpdate, force_init });

          // wait_a_second({action:"hide"})

        }).catch(function (err) {
          // document.querySelector(".search_display").innerHTML = "";
          let e_mode = obj_exists(err, "mode") ? err.mode : err;
          if (err == "" || err == undefined || e_mode == "cancel") {
            console.log("search_log clear");
          } else {
            console.error("http request error", err);
          }//end else
          // wait_a_second({ action: "hide" })
        });//end catch

    } catch (error) {
      console.error(`[search_contacts] n error occured`,error)
    }

  }//end mc_search
