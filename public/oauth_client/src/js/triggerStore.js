  console.log("[passportStore]");
  import { observable, autorun, runInAction, action, computed, decorate } from 'mobx';
  import axios from 'axios';
  // import { AUTH_SIGN_UP, AUTH_SIGN_OUT, AUTH_SIGN_IN, DASHBOARD_GET_DATA, AUTH_ERRORS } from './types';

  class TriggerStore {
    constructor(triggerservice) {
      this.triggerService = triggerservice;
    }// constructor

    sponsor_id = null;
    client_id = null;

    @action setSponsor = (sId, sImg) => {
      this.sponsor_id = sId;
      this.sponsor_image = sImg;
    }// setSponsor

    @action setClient = (cId) => {
      this.client_id = cId;
    }// setClient

    
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