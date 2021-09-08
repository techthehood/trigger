  console.log("[passportStore]");
  import { observable, autorun, runInAction, action, computed, decorate } from 'mobx';
  import axios from 'axios';
  // import { AUTH_SIGN_UP, AUTH_SIGN_OUT, AUTH_SIGN_IN, DASHBOARD_GET_DATA, AUTH_ERRORS } from './types';

  class PassportStore {
    constructor(passportservice) {
      this.PassportService = passportservice;
    }// constructor

    DEFAULT_STATE = {
      isAuthenticated: false,
      token: '',
      errorMessage: '',
      secret: ''
    }

    // sponsor_id = null;
    // client_id = null;

    // @action setSponsor = (sId, sImg) => {
    //   this.sponsor_id = sId;
    //   this.sponsor_image = sImg;
    // }// setSponsor

    // @action setClient = (cId) => {
    //   this.client_id = cId;
    // }// setClient

    @observable state = { ...this.DEFAULT_STATE};

    @action setState = (obj) => {
      // this.state = { ...this.state, ...obj };
      this.state = {...obj};
    }// setState

    @action setAuth = ({token, auth = false}) => {
      this.state = {...this.state, token, isAuthenticated: auth};
    }

    @action signIn = async (data) => {
        /*
        Step 1: Use the data to make HTTP requrest to our Backend and send it along [x]
        Step 2: Take the Backend's response (jwtToken is here now!) [x]
        Step 3: Dispatch user just signed up (with jwtToken) [x]
        Step 4: save the jwtToken into our localStorage [x]
        */

        try {
          console.log('[ActionCreator] signIn called!');
          // const res = await axios.post('http://localhost:3000/api/auth/signup', data);
          //
          /**
           * @function res
           * @desc runs axios request to sign in user
           * @requires OAServer-routers-oauth
           * @example const res = await axios.post(`${location.origin}/api/auth/signin`, data);
           * @returns {object} jw_token
           */
          const res = await axios.post(`${location.origin}/api/auth/signin`, data);

          console.log("[axios res]",res);

          console.log('[ActionCreator] signIn dispatched an action!');
          // dispatch({
          //   type: AUTH_SIGN_IN,
          //   payload: res.data.token
          // });

          this.setState({ ...this.state, token: res.data.token, isAuthenticated: true, errorMessage: ''});

          localStorage.setItem('JWT_TOKEN', res.data.token);
          axios.defaults.headers.common['Authorization'] = res.data.token;

          return;

        } catch (err) {
          // dispatch({
          //   type: AUTH_ERRORS,
          //   payload: 'Email and password combination isn\'t valid'
          // })
          this.setState({ ...this.state, errorMessage: 'Email and password combination isn\'t valid' });

          return;
        }
    }// signIn

    @action signUp = async (data) => {
        /*
        Step 1: Use the data to make HTTP requrest to our Backend and send it along [x]
        Step 2: Take the Backend's response (jwtToken is here now!) [x]
        Step 3: Dispatch user just signed up (with jwtToken) [x]
        Step 4: save the jwtToken into our localStorage [x]
        */

        try {
          console.log('[ActionCreator] signUp called!');
          // const res = await axios.post('http://localhost:3000/api/auth/signup', data);
          /**
           * @function res
           * @desc runs axios request to sign up a new user
           * @requires OAServer-routers-oauth
           * @example const res = await axios.post(`${location.origin}/api/auth/signup`, data);
           * @returns {object} jw_token
           */
          const res = await axios.post(`${location.origin}/api/auth/signup`, data);

          console.log("[axios res]",res);

          console.log('[ActionCreator] signUp dispatched an action!');
          // dispatch({
          //   type: AUTH_SIGN_UP,
          //   payload: res.data.token
          // });
          this.setState({ ...this.state, token: res.data.token, isAuthenticated: true, errorMessage: '' });

          localStorage.setItem('JWT_TOKEN', res.data.token);
          axios.defaults.headers.common['Authorization'] = res.data.token;

          return;

        } catch (err) {
          // dispatch({
          //   type: AUTH_ERRORS,
          //   payload: 'Email is already in use'
          // })
          this.setState({ ...this.state, errorMessage: 'Email is already in use' });

          return;
        }

      
    }// signUp

    @action oauthGoogle = async (data) => {
        try {
          console.log("We received the accessToken", data);

          const res = await axios.post(`${location.origin}/api/auth/oauth/google`, { access_token: data });

          console.log("[axios res]",res);

          // dispatch({
          //   type: AUTH_SIGN_UP,
          //   payload: res.data.token
          // });
          this.setState({ ...this.state, token: res.data.token, isAuthenticated: true, errorMessage: '' });

          localStorage.setItem('JWT_TOKEN', res.data.token);
          axios.defaults.headers.common['Authorization'] = res.data.token;
          
          return;
          
        } catch (err) {
          console.log("oauthGoogle error", err);
          // dispatch({
            //   type: AUTH_ERRORS,
            //   payload: 'oauthGoogle error' + err
            // });
            this.setState({ ...this.state, errorMessage: 'oauthGoogle error' + err });
            
            return;
          }

    }// oauthGoogle

    @action oauthFacebook = async (data) => {
        try {
          console.log("We received the accessToken", data);

          // const res = await axios.post('http://localhost:3000/api/auth/oauth/facebook', { access_token: data });
          /**
           * @function res
           * @desc takes the google data generated from the facebook sign in btn iframe and passes it to the server for verification
           * @requires OAServer-routers-oauth
           * @example const res = await axios.post(`${location.origin}/api/auth/oauth/facebook`, { access_token: data });
           * @returns {object} jw_token
           */
          const res = await axios.post(`${location.origin}/api/auth/oauth/facebook`, { access_token: data });

          console.log("[axios res]",res);

          // dispatch({
          //   type: AUTH_SIGN_UP,
          //   payload: res.data.token
          // });
          this.setState({ ...this.state, token: res.data.token, isAuthenticated: true, errorMessage: '' });

          localStorage.setItem('JWT_TOKEN', res.data.token);
          axios.defaults.headers.common['Authorization'] = res.data.token;

          return;

        } catch (err) {
          console.log("oauthFacebook error", err);

          // dispatch({
          //   type: AUTH_ERRORS,
          //   payload: 'oauthFacebook error' + err
          // });
          this.setState({ ...this.state, errorMessage: 'oauthFacebook error' + err });

          return;
        }
    }// oauthGoogle

    @action signOut = async () => {
          try {
              localStorage.removeItem('JWT_TOKEN');
              axios.defaults.headers.common['Authorization'] = '';

              // dispatch({
              //   type: AUTH_SIGN_OUT,
              //   payload: ''
              // })
              this.setState({ ...this.state, token: '', isAuthenticated: false, errorMessage: '' });
              return;

          } catch (err) {
            // console.log("signout error", err);
            // dispatch({
            //   type: AUTH_ERRORS,
            //   payload: 'there was an issue signing out'
            // });
            this.setState({ ...this.state, errorMessage: 'there was an issue signing out'});
            return;
          }// catch
    }// signOut

    @action getSecret = async () => {

        try {
          console.log('[ActionCreator] trying to get BE\'s secret');

          //need jwtToken in axios header to work
          const res = await axios.get(`${location.origin}/api/auth/secret`);

          console.log("[axios res]",res);

          // dispatch({
          //   type: DASHBOARD_GET_DATA,
          //   payload: res.data.secret

          // })
          // this.secret = res.data.secret;
          this.setState({ ...this.state, secret: res.data.secret });

        } catch (e) {
          console.log('error',e);
        }
    }// getSecret
  }// PassportStore

  // const store = new DraftStore(store_api);
  const store = window.passportStore = new PassportStore();

  export default store;

  autorun(() => {
    console.log("[passportStore] ITEM_DATA ", store.state);
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