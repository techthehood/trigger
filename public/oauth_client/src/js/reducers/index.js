import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';

import authReducer from './auth';
import dashboardReducer from './dashboard';

export default combineReducers({
  form: formReducer,
  auth: authReducer,
  dash: dashboardReducer
})
/*
this becomes the part of the global state that these reducers initial state is connected to.
so to get to the authReducers errorMessage you need to goto state.auth.errorMessage
*/
