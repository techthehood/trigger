// console.log('[quick panel running]');
const {get_pp_contents} = require('./main');
const {get_mobx} = require('./mobx');
const {get_mxr} = require('./mxr');
// [require is not defined](https://stackoverflow.com/questions/19059580/client-on-node-uncaught-referenceerror-require-is-not-defined)
// const Guest = require('./guestContent');
require("../css/profile_panel_module.scss");
require("../css/style.scss");
const testing = false;

document.addEventListener('DOMContentLoaded', async function () {
// $(document).ready(function () {

  // $("#sidebar").mCustomScrollbar({
  //     theme: "minimal"
  // });

  let closeList = document.querySelectorAll('.pp_dismiss, .pp_overlay');

  closeList.forEach( item => {

    // $('.pp_dismiss, .pp_overlay').on('click', function () {
    item.addEventListener("click", function () {

      // hide sidebar
      // $('#pp_sidebar').removeClass('active');
      document.querySelector('#pp_sidebar').classList.remove('active');
      // hide overlay
      // $('.pp_overlay').removeClass('active');
      // document.querySelector('.pp_overlay').classList.remove('active');

    });
    // });

  });

  // i think the pp_panelBtn is really a container to hold the pp_panelBtn - i don't think it should be an actual btn unless you have viewer data
  // the panel itelf can also be empty until you add properties.
  // this is just a framework for a working panel

  if(testing == true){
    let target_cont = document.querySelector('#pp_panelCtrl')
    target_cont.className = "pp_panelCtrl pp_panelBtn icon-user d3-ico d3-disc d3-disc-outer d3-disc d3-disc-outer-outer d3-disc-bg";
    target_cont.addEventListener('click', function () {

      // $('#pp_panelBtn').on('click', function () {
      // open sidebar
      // $('#pp_sidebar').addClass('active');
      document.querySelector('#pp_sidebar').classList.add('active');
      // fade in the overlay
      // $('.pp_overlay').addClass('active');
      // document.querySelector('.pp_overlay').classList.add('active');// deprecated
      // $('.collapse.in').toggleClass('in');
      // document.querySelector('.collapse.in').classList.toggle('in');// deprecated
      // $('a[aria-expanded=true]').attr('aria-expanded', 'false');
      // });

    });
  }

  get_pp_contents();
  // get_mobx();// use 'nrd' in the root directory to activate throught webpack
  // get_mxr();


});
