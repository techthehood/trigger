import axios from 'axios';
import { AUTH_SIGN_UP } from './types';
// console.log("[host]",location.host);

// ActionCreators
console.log("[actions] index.js");


export const signIn = (data) => {
  return async (dispatch) => {
    /*
    Step 1: Use the data to make HTTP requrest to our Backend and send it along [x]
    Step 2: Take the Backend's response (jwtToken is here now!) [x]
    Step 3: Dispatch user just signed up (with jwtToken) [x]
    Step 4: save the jwtToken into our localStorage [x]
    */

    // try {
    //   console.log('[ActionCreator] signIn called!');
    //   // const res = await axios.post('http://localhost:3000/api/auth/signup', data);
    //   const res = await axios.post(`${location.origin}/api/auth/signin`, data);
    //
    //   console.log("[axios res]",res);
    //
    //   console.log('[ActionCreator] signIn dispatched an action!');
    //   dispatch({
    //     type: AUTH_SIGN_IN,
    //     payload: res.data.token
    //   });
    //
    //   localStorage.setItem('JWT_TOKEN', res.data.token);
    //   axios.defaults.headers.common['Authorization'] = res.data.token;
    //
    // } catch (err) {
    //   dispatch({
    //     type: AUTH_ERRORS,
    //     payload: 'Email and password combination isn\'t valid'
    //   })
    // }// catch

  }// return
}// signIn
