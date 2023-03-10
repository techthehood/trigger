

  // console.log(`toast running!`);
  // const {toaster} = require('../elements/Toast/toaster.js');
  // import React from 'react';
  import ReactDOM from 'react-dom';

  import  Toast from './Toast';

  const {wrapr} = require('../../tools/wrapr');


/**
 * popup message that can be added to a DOM elemenet and set to automatically fade away after x seconds
 * @module action-msg
 * @category Tools
 * @requires Toast
 * @requires wrapr
 * @param  {Object} obj wrapper for all params
 * @param  {String} obj.home                          DOM element root
 * @param  {String} obj.name                          unique string identifier/reference
 * @param  {Number} [obj.iUN=Math.round(Math.random() *             10000)}] individual unique number
 * @return {Void}     returns false
 * @example
 * const {toaster} = require('../../elements/Toast/toaster.js');
 * toaster({mode:"show",prefix,message:sort_txt_obj[label_txt],auto:true,sec:5});
 * toaster({home:`.${prefix}message_display_span`,message:sort_txt_obj[label_txt],auto:true,sec:5});
 */

  export const toaster = (obj) => {

  // state is not needed
  let {home = ".toaster_home", name, custom, iUN = Math.round(Math.random() * 10000)} = obj;

  let toasters = document.querySelectorAll(`.toast_cont`);

  if(typeof toasters != "undefined"){
    toasters = Array.from(toasters);
    toasters.forEach((entry) => {
      entry.classList.add("hide");
    })
  }

  // generate home container
  /**
   * @function wrapr
   * @requires wrapr
   */
  let toast_home = wrapr({name:`${name}_wrapr_cont`,iUN, home, custom:"toaster"});

    ReactDOM.render(
      <Toast data={{...obj/*, auto: false*/}} wrapper={true}/>,
      toast_home
    );

    // else do this
  }//toaster


  // usage:
  // const {toaster} = require('../elements/Toast/toaster.js');
  // toaster({mode:"show",prefix,message:sort_txt_obj[label_txt],auto:true,sec:5});
  // toaster({home:`.${prefix}message_display_span`,message:sort_txt_obj[label_txt],auto:true,sec:5});

/**
 * @memberof action-msg
 */
