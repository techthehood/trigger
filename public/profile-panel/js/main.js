import ReactDOM from "react-dom";
import { Provider } from 'mobx-react';


import Guest from "./components/Guest";
import Profile from "./components/Profile/";
import ProfileStore from "./components/Profile/ProfileStore";
import ErrorBoundary from "./components/Error";


export const get_pp_contents = () => {

    let react_display;

    const jwtToken = localStorage.getItem('JWT_TOKEN');
    // console.log("[jwtToken]", jwtToken);

    if(typeof jwtToken != "undefined" && jwtToken != null){
      axios.defaults.headers.common['Authorization'] = jwtToken;
      react_display = (
        <Profile />
      );

      // http://localhost:3000/auth/signup
      // http://localhost:3000/auth/signin
    }else{
      react_display = (
        <Guest />
      );
    }//else



    // pp_content_cont
    ReactDOM.render(
        /*<Provider store={createStore(reducers, {})}>*/
        <ErrorBoundary>
          <Provider ProfileStore={ProfileStore} >
            <Profile />
          </Provider>
        </ErrorBoundary>,
        document.querySelector(".pp_content_cont")
    );



}// get_pp_contents
