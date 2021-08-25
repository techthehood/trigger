import ReactDOM from "react-dom";
import TodoList from "./components/todo/TodoList";
import Store from "./components/todo/TodoStore";
import ErrorBoundary from "./components/Error";
import "../css/mobx.scss";


export const get_mobx = () => {

    // pp_content_cont
    ReactDOM.render(
        <ErrorBoundary>
          <TodoList store={Store} />
        </ErrorBoundary>,
        document.querySelector(".pp_mobx_cont")
    );

}// get_mobx
