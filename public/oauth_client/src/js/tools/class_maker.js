
// const {class_maker} = require('../../tools/class_maker');
const {exists} = require('./exists');

const class_maker = ({prefix = "", name = "", main = "", iUN = "" , ndx = "", no_name = false, no_main = false}) => {

  // LATER: reconfirgure class_maker

  let name2 = exists(name) ? name + "_" : "",
  main2 = exists(main) ? main + "_" : "";
  iUN2 = exists(iUN) ? iUN + "_" : "";

  prefix = exists(prefix) ? prefix.replace("_","") : "";//prefix shouldn't have an underscore for this
  prefix2 = exists(prefix) ? prefix + "_" : "";

  let prefixes = (exists(prefix)) ? `${prefix2}${name2}${main2}${iUN} ${prefix2}${name2}${main}` : "",
  names = exists(name) ? `${name2}${main2}${iUN} ${name2}${main} ${name2}${iUN} ${ no_name ? "" : name}` : "",
  mains = exists(main) ? `${main2}${iUN} ${no_main ? "" : main}` : "";

  ndxes = (typeof ndx != "undefined" && ndx !== "") ? [`${prefix}${name2}${main2}${iUN2}${ndx}`,
  `${prefix}${name2}${main2}${ndx}`,
  `${name2}${main2}${ndx}`,
  `${name2}${iUN2}${ndx}`,
  `${main2}${iUN2}${ndx}`].join(" ") : "";

  let return_txt = [`${ndxes}`,
  `${prefixes}`,
  `${names}`,
  `${mains}`,
  `${iUN}`].join(" ");


  return return_txt.trim();
}

module.exports = {class_maker}

// examples from modal.js
// sample using no_main because there is a conflict with using modal_cont as a standalone class -
// no_main will not add modal_cont as a class by itself
// let wrapper_class = {className: `${class_maker({prefix, name, main: "modal_cont", iUN, no_main: true})} ${tag} ${w3Modal} ${wrapper_addClass} ${visible} core_modal`};

// let content_class = {className: `${class_maker({prefix, name, main: "content", iUN})} glass_content ${tag} ${content_addClass}`};
