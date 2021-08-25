  import ReactDOM from "react-dom";
  import { Provider } from 'mobx-react';
  // using a provider makes the store available to all the children app components without passing store props to each one


  import BirdList from "./components/bird-cage/BirdList";
  import BirdStore from "./components/bird-cage/BirdStore";
  import ErrorBoundary from "./components/Error";
  import "../css/mobx.scss";


  export const get_mxr = () => {

    const root = (
      <ErrorBoundary>
        <Provider BirdStore={BirdStore} >
          <BirdList />
        </Provider>
      </ErrorBoundary>
    )

      // pp_content_cont
      ReactDOM.render(
          root,
          document.querySelector(".pp_mxr_cont")
      );

  }// get_mxr
