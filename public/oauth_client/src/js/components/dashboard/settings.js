import { demo_update } from "../../tools/demo";

export const bg_images = [
  "https://images.pexels.com/photos/5213836/pexels-photo-5213836.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",/*grass*/
  "https://images.pexels.com/photos/6647971/pexels-photo-6647971.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",/*orchid*/
  "https://images.pexels.com/photos/2363347/pexels-photo-2363347.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",/*limes*/
  "https://images.pexels.com/photos/6462155/pexels-photo-6462155.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",/*grapefruits*/
  "https://images.pexels.com/photos/6100567/pexels-photo-6100567.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",/*tower*/
  "https://images.pexels.com/photos/4545827/pexels-photo-4545827.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",/*tower2*/
]

// DOCS: see my_storage.md for notes on adding to user_prefs
// DOCS: to add to profile panel settings without adding to user_prefs add to default_prefs & default_pref_obj
export const default_prefs = [
  "auto_editor",
  "dark_mode",
  "text_view",
  "main_ctrls",
  "main_transition",
  "tool_tips",
  "welcome_screen",
  "whats_new",
  "demo_mode",
  "active_demo"
  ];// "filter", "track_tabs" - im only using prefs i can identify

  // what are these?
  export const state_values = [
    "text_view",
    "main_ctrls",
    "main_transition",
    "dark_mode"
  ];
  // add new value to main and mainStore files

// NOTE: you only have to add to default_prefs and default_pref_obj to add new profile panel settings
// GOTCHA: items show up in the panel but not wired to save to storage
// how do you wire them to save to storage (localforage? sessionStorage?)
export const default_pref_obj = {
  // filter:{
  //   title:"",
  //   form:"",
  //   property:"filter",
  //   value:"default",
  //   callback:() => {},
  //   description:""
  // },
  auto_editor:{
    title:"auto editor",
    form:"toggle",
    storage: "user_prefs",
    property:"auto_editor",
    option_type: "boolean",
    value:false,
    callback:() => {},
    description:"automatically updates your credentials to project editor on page load"
    //doesn't need to be in settings
  },
  dark_mode:{
    title:"dark mode",
    form:"toggle",
    storage: "user_prefs",
    property:"dark_mode",
    option_type: "boolean",
    value:false,
    callback:() => {},
    description:"switch display to dark mode?"
    //doesn't need to be in settings
  },
  main_ctrls:{
    title:"toolbar",
    form:"cycle",
    storage: "user_prefs",
    property:"main_ctrls",
    option_type:"string",
    options: {
      "left": { title: 'right', icon: 'circle-left' },
      "right": { title: 'bottom', icon: 'circle-right' },
      "bottom": { title: 'left', icon: 'circle-down' },
    },
    default_value: "bottom",
    value:"bottom",
    callback:() => {},
    description:"determines the alignment of the main section toolbar."
  },
  main_transition: {
    title: "transition",
    form: "group",
    storage: "user_prefs",
    property: "main_transition",
    option_type: "string",
    options: ["auto", "scroll", "tab"],
    value: "auto",
    callback: () => { },
    description: "determines how the main section btns transition to other sections."
  },
  text_view:{
    title:"images",
    form:"toggle",
    storage: "user_prefs",
    property:"text_view",
    option_type: "string",
    options:["expanded","minified"],
    true_ndx:0,
    value:"expanded",
    callback:() => {},
    description:""
  },
  tool_tips:{
    title:"startup tips",
    form:"toggle",
    storage: "user_prefs",
    property:"tool_tips",
    option_type: "boolean",
    value:true,
    callback:() => {},
    description:"show tool tips on startup",
    group: { name: "tool_tips", title: "tool tips" }
    //doesn't need to be in settings
  },
  welcome_screen: {
    title: "welcome",
    form: "toggle",
    storage: "user_prefs",
    property: "welcome_screen",
    option_type: "boolean",
    value: true,
    callback: () => { },
    description: "show welcome screen in tool tips",
    group: {name: "tool_tips", title: "tool tips"}
    //doesn't need to be in settings
  },
  whats_new: {
    title: "Whats New",
    form: "toggle",
    storage: "user_prefs",
    property: "whats_new",
    option_type: "boolean",
    value: true,
    callback: () => { },
    description: "show whats new screen in tool tips",
    group: { name: "tool_tips", title: "tool tips" }
    //doesn't need to be in settings
  },
  track_tabs:{
    title:"remember tabs",
    form:"toggle",
    storage: "user_prefs",
    property:"track_tabs",
    // options:[true,false],/*no need for options*/
    option_type: "boolean",
    value:false,
    callback:() => {},
    description:"used in bookmark popup to remember last tab you used"
    //doesn't need to be in settings
  },
  demo_mode: {
    title: "demo mode",
    form: "toggle",
    storage: "demo",
    property: "demo_mode",
    option_type: "boolean",
    value: false,
    callback: () => { },
    update: demo_update,
    description: "show demo highlighting on click events",
    group: { title: "demo mode" }
    //doesn't need to be in settings
  },
  active_demo: {
    title: "active demo",
    form: "toggle",
    storage: "active_demo",
    property: "active_demo",
    option_type: "boolean",
    custom_class: "active_demo",
    value: true,
    callback: () => { },
    update: demo_update,
    description: "disable demo click events",
    group: {title: "demo mode" }
    //doesn't need to be in settings
  },
}

// LATER: create a "whats new" tool tip
