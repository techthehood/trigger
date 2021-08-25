import { AUTH_SIGN_UP } from '../actions/types';

const DEFAULT_STATE = {
  isAuthenticated: false,
  token: '',
  errorMessage: ''
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case AUTH_SIGN_UP:
        console.log('[AuthReducer] got an AUTH_SIGN_UP action!');
        return { ...state, token: action.payload, isAuthenticated: true, errorMessage: '' }
      break;

    default:

  }//switch
  return state;
}
