
  // const {wrapr} = require('../../tools/wrapr');
  const {exists} = require('./exists');

  /**
   * @fileOverview Create a wrapper that has been appended to a root DOM element and can be referecend using ReactDOM.render.
   * its useful to allow multiple components to be added to the same DOM element without overwriting other elements
   * @category Tools
   * @module wrapr
   * @param  {String} [name=""]                      unique name to reference the container
   * @param  {String} [id=name                      ||            ""]    same as the name unless no name is given
   * @param  {String} home                          this wrapr's root or home container
   * @param  {String} [custom=""]                   custom class to be added to className
   * @param  {Number} [iUN=Math.round(Math.random() *             10000)               }]  a individual unique number
   * @return {Object}                      wrapper container to be used with ReactDOM.render
   * @example
   * let share_modal_cont = wrapr({name:"clip_modal_cont",iUN, home: ".modal_home", custom:"w3-part block"});
   * let modal_temp_cont = wrapr({name:"modal_temp_cont", home: ".modal_home", custom:"w3-part block"});
   * // => DOM wrapper object
   */


  export const wrapr = ({
    name = "",
    id=name || "",
    home = false,
    custom = "",
    iUN = Math.round(Math.random() * 10000),
    replace = false
  }) => {

  /** @var {string} iUN2 a stringified version of an iUN complete with underscore for pretty separation */
    let iUN2 = `_${iUN}`;

    /**
     * @var modal_home
     * @type {Object}
     * @desc modal_home selects the .modal_home DOM element
     * accepts a string that is already preformated with an indicator (.classIndicator) (#idIndicator)
     * @example
     * let home = `.modal_home`;// #modal_cont
     * let modal_home = document.querySelector(`${home}`);
     */
    let modal_home
    if(typeof home != "boolean"){
      modal_home = document.querySelector(`${home}`);// input should include . or #
    }

    let wrapr_cont = document.createElement('div');
    if(id != "") wrapr_cont.id = id;
    wrapr_cont.className = `${id}${ exists(id) ? iUN2 : ""} ${id} ${name}${ exists(id) ? iUN2 : ""} ${name} ${custom}`;//block i can control visibility here

    if (typeof home != "boolean" && typeof replace != "boolean") {

      let replaceable = modal_home.querySelector(`${replace}`);
      modal_home.replaceChild(wrapr_cont,replaceable);

    }else if ( typeof replace != "boolean") {
      // untested - when its ready it should be able to replace anything in the DOM
      // home is not required
      let replaceable = document.querySelector(`${replace}`);
      document.replaceChild(wrapr_cont,replaceable);

    } else if ( typeof home != "boolean"){

      // add wrapper to home - home is required
      modal_home.appendChild(wrapr_cont);

    }else{
      throw new Error("home is required");
    }

    // return the object
    return wrapr_cont;

  }// wrapr
