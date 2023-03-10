


const has_extra_data = function({extra, layout},verbose = false){
  // validates the extra data?

  let has_extra = false;
  let type;
  // first test
  if(typeof extra == "undefined" || extra == "" || extra == "{}" || extra == {}){
    type = null;
    has_extra =  false;
    return (verbose) ? {has_extra, type} : has_extra;
  }

  //2nd test
  if(typeof extra == "string" && extra.indexOf("{") == -1){
    // return true;
    type = "array";// its an extra array - legacy extra
    has_extra =  true;
    return (verbose) ? {has_extra, type} : has_extra;
  }// its an extra array - legacy extra

  // 3rd test
  let test_extra = (typeof extra != "string") ? extra : JSON.parse(extra);

  let extra_keys = Object.keys(test_extra);

  //if it has the old format or it has the target layout - true
  // return (extra_keys.includes("img_url") || extra_keys.includes(state.layout)) ? true : false;
  if(verbose){
    type = (extra_keys.includes("img_url")) ? "legacy" :
    ( typeof layout == "string" && extra_keys.includes(layout) ||
    Array.isArray(layout) && extra_keys.some((key) => {
      return layout.includes(key);
    }) ) ? "verbose" : null;


    has_extra = ( extra_keys.includes("img_url") ||
    typeof layout == "string" && extra_keys.includes(layout) ||
    Array.isArray(layout) && extra_keys.some((key) => {
      return layout.includes(key);
    }) ) ? true : false;

    return {has_extra, type};

  }else{
    return extra_keys.length > 0 ? true : false;
  }

}

module.exports = {has_extra_data};
