import Dashboard from './Dashboard'
export const start_dashboard = () => {
  ReactDOM.render(
    <Dashboard/>,
    document.querySelector(".pp_content_cont")
  );
}
