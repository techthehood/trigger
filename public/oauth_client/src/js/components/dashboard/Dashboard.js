import Dash_bg from "./Dash_bg";
import ProfileIcon from '../ProfileIcon/ProfileIcon';
// import Dash_title from './Dash_title';
// import Dash_set from './Dash_set';
import {observer} from 'mobx-react';
import { exists } from "../../tools/exists";
const triggerStore = require('../../triggerStore').default;

const {bg_images} = require('./settings');
require("./Dashboard.scss");

const display_console = false;

const Dashboard = observer(() => {
  console.warn('dashboard is running');
  let state = triggerStore;
  let text_only_mode;// = state.text_view != "expanded" ? true : false;

  // let profile_data = {preset_data:VIEWER_DATA.preset_data, name: "dash_profile", deep_dive:true, no_class: false, text_only_mode};
  let profile_data = { name: "dash_profile", deep_dive: true, no_class: false };
  let user = triggerStore.client.id ? triggerStore.client : triggerStore.sponsor;

  let default_image = user.default_image;
  let image = user.image;

  if(default_image) profile_data.default_image = default_image;
  if(image) profile_data.image = image;
  if (!exists(image) && !exists(default_image)){ 
    text_only_mode = true; 
    profile_data.text_only_mode = true;
  }// if

  if(display_console || true) console.log(`[Dashboard] triggerStore`, triggerStore);

  return (
    <div className={`dashboard_wrapper`} data-comp={`Dashboard`}>
      <div className={`dashboard_header`}>
        <Dash_bg {...{bg_images, text_only_mode}}/>
        <ProfileIcon {...{...profile_data}}/>
        {/* <Dash_title {...{state, project_item: {...VIEWER_DATA.project_item}}}/> */}
      </div>
      {/* <Dash_set {...{state, viewer: VIEWER_DATA}} /> */}
    </div>
  )
})

export default Dashboard;
