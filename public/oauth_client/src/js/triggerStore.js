  console.log("[passportStore]");
  import { observable, autorun, runInAction, action, computed, decorate } from 'mobx';
  import axios from 'axios';
  // import { AUTH_SIGN_UP, AUTH_SIGN_OUT, AUTH_SIGN_IN, DASHBOARD_GET_DATA, AUTH_ERRORS } from './types';
  const { exists } = require('./tools/exists');

  class TriggerStore {
    constructor(triggerservice) {
      this.triggerService = triggerservice;
    }// constructor

    @observable sponsor = {id: null};
    @observable client = {id: null};
    @observable type = "sponsor";
    @observable contacts = {};

    @action setSponsor = (sponsor) => {
      // {sponsor_id, image, default_image, username}
      // this.sponsor.id = sponsor_id;
      // this.sponsor.image = image;
      // this.sponsor.default_image = default_image;
      // this.sponsor.username = username;
      this.sponsor = {...sponsor};
    }// setSponsor

    @action setClient = (cId) => {
      this.client.id = cId;
      this.type = "client";
    }// setClient

    create_order = ({ result }) => {

      let result_id_ary = [];
      let result_id_obj = {};// sets item._id's as object keys

      if (Array.isArray(result) && result.length != 0) {
        result.forEach((item) => {
          result_id_ary = [...result_id_ary, item._id];// this will help with ordering
          result_id_obj[item._id] = item;

          // read item feed template and determine visible_area height
        });
      }//if

      let result_ids = [...result_id_ary];
      let result_data = { ...result_id_obj };
      return { result_ids, result_data };

    }// create_order

    @action update_contacts = async (
      {
        result_obj,
        type,
        active_filters,
      }
    ) => {
      // convert the rows array into an object with id's as keys
      let result = result_obj.data;

      const { result_ids, result_data } = this.create_order({ result });


      for (let i = 0; i < 5; i++) {
        if (exists(result_data[result_ids[i]])) {
          // console.log("[result_data] order",result_data[result_ids[i]].title_data);
        }
      }

      //can also set the binders default arrangement - (created)
      // alpha is set on the server so there is no need for created
      let sort_by = (result_obj.filter != undefined && result_obj.filter != "") ? result_obj.filter : "created";

      try {

        if (result_obj.scroll_data.mode == "init") {

          // let test_contacts = this.contacts[`${type}`];
          // let temp_active_filter = (exists(test_contacts) && exists(test_contacts.active_filters)) ?
          //   [...test_contacts.active_filters] : active_filters;// this.default_active_filters

          // NOTE: i think i really want this to only work with one contact type at a time
          this.contacts[`${type}`] = {};

          // this.contacts[`${type}`].active_filters = [...temp_active_filter];// if init, why do i need old data?
          this.contacts[`${type}`].active_filters = active_filters;

          this.contacts[`${type}`].order = [...result_ids];// an array of only ids
          // this.contacts[`${type}`].data = result;//string
          this.contacts[`${type}`].data = result_data;//string
          this.contacts[`${type}`].created = (new Date()).getTime();

        } else {
          let last_order = [...this.contacts[`${type}`].order];
          this.contacts[`${type}`].order = [...new Set([...last_order, ...result_ids])];//Set to make sure all ids are unique values


          let last_data = { ...this.contacts[`${type}`].data }
          this.contacts[`${type}`].data = { ...last_data, ...result_data };//string
        }

        // this.contacts[`${type}`].display_filter = sort_by;
        this.contacts[`${type}`].scroll_data = result_obj.scroll_data;// roll filter_text into the scroll_data
        this.contacts[`${type}`].modified = (new Date()).getTime();
        // this.contacts[`${type}`].filter = sort_by;

        // if (exists(result_obj.category)) this.contacts[`${type}`].category = result_obj.category;// unneccessary

        return result;

      } catch (err) {
        console.error(`[get] there was an issue parsing the result json`, err);
      }//catch
    }// update_contacts

    
  }// TriggerStore

  // const store = new DraftStore(store_api);
  const store = window.triggerStore = new TriggerStore();

  export default store;

  autorun(() => {
    console.log("[TriggerStore] ITEM_DATA ", store.state);
    // console.log(store.todos[0]);
  })


// export default (state = DEFAULT_STATE, action) => {
//   switch (action.type) {
//     case AUTH_SIGN_UP:
//       console.log('[AuthReducer] got an AUTH_SIGN_UP action!');
//       return { ...state, token: action.payload, isAuthenticated: true, errorMessage: '' }
//       break;
//     case AUTH_SIGN_IN:
//       console.log('[AuthReducer] got an AUTH_SIGN_IN action!');
//       return { ...state, token: action.payload, isAuthenticated: true, errorMessage: '' }
//       break;
//     case AUTH_SIGN_OUT:
//       console.log('[AuthReducer] got an AUTH_SIGN_OUT action!');
//       return { ...state, token: action.payload, isAuthenticated: false, errorMessage: '' }
//       break;
//     case AUTH_ERRORS:
//       console.log('[AuthReducer] got an AUTH_ERRORS action!');
//       return { ...state, errorMessage: action.payload };
//       break;

//     default:

//   }