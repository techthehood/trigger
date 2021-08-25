import { AUTH_SIGN_UP, AUTH_SIGN_OUT, AUTH_SIGN_IN, AUTH_ERRORS } from '../actions/types';

const DEFAULT_STATE = {
  isAuthenticated: false,
  token: '',
  errorMessage: ''
}

/**
 * @module  OAClient-reducers-auth
 * @category Auth
 * @subcategory reducers
 * @param  {object} state [description]
 * @param {object} action
 * @return {object} state     [description]
 * @desc redux action
 * @see [OAClient-actions (linkback)]{@link module:OAClient-actions}
 */

/**
 * @file
 */

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case AUTH_SIGN_UP:
        console.log('[AuthReducer] got an AUTH_SIGN_UP action!');
        return { ...state, token: action.payload, isAuthenticated: true, errorMessage: '' }
      break;
      case AUTH_SIGN_IN:
      console.log('[AuthReducer] got an AUTH_SIGN_IN action!');
      return { ...state, token: action.payload, isAuthenticated: true, errorMessage: '' }
      break;
    case AUTH_SIGN_OUT:
        console.log('[AuthReducer] got an AUTH_SIGN_OUT action!');
        return { ...state, token: action.payload, isAuthenticated: false, errorMessage: '' }
      break;
    case AUTH_ERRORS:
        console.log('[AuthReducer] got an AUTH_ERRORS action!');
        return { ...state, errorMessage: action.payload };
      break;

    default:

  }
  return state;
}
