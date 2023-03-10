import { obj_exists } from "./exists";

export const demo = (cls,callback,) => {

    return callback();
  // defend from triggering multiple elements during the waiting period
  if(obj_exists(VIEWER_DATA,"DEMO.timer")) clearTimeout(VIEWER_DATA.DEMO.timer);
  try {
    if (obj_exists(VIEWER_DATA,"DEMO.target") && VIEWER_DATA.DEMO.target.classList) VIEWER_DATA.DEMO.target.classList.remove('shonuff');
  } catch (error) {}

  // start a new timeout if in demo mode
  if(obj_exists(VIEWER_DATA,"DEMO.show") && VIEWER_DATA.DEMO.show === true){
    // if in demo mode do this
    if(typeof cls == "string") cls = !cls.includes(".") && !cls.includes("#") ? `.${cls}` : cls;
    let target = typeof cls == "string" ? document.querySelector(cls) : cls;
    VIEWER_DATA.DEMO.target = target;
    // add the delayed view to the display
    target.classList.add('shonuff');

    VIEWER_DATA.DEMO.timer = setTimeout(() => {
      try {
        // try to reset the element if its still active
        target.classList.remove('shonuff');
      }catch(error){}
      
      // clear the record of the element
      // if(VIEWER_DATA.DEMO.target) delete VIEWER_DATA.DEMO.target
      // clear the timer
      clearTimeout(VIEWER_DATA.DEMO.timer);

      if(VIEWER_DATA.DEMO.active === false && force_active != true) return;// if in demo mode && active is false do nothing

      callback();// does it preserve the params?
    }, 5000);
  }else{
    callback();
  }
}

export const demo_update = ({ value, active }) => {

    let update_mode = [];
    if(typeof value != "undefined") update_mode.push("show");
    if(typeof active != "undefined") update_mode.push("active");

    update_mode.forEach((entry) => {
      let test_value = entry == "active" ? active : value;
      let storage_str = entry == "show" ? "DEMO" : "DEMO_ACTIVE";
      switch (test_value) {
        case true:
          // update sessionStorage
          sessionStorage.setItem(storage_str, "true");
          try {
            // update VIEWER_DATA
            VIEWER_DATA.DEMO[`${entry}`] = true;
          } catch (error) {
            console.error('[settings.js] VIEWER_DATA.DEMO issue');
          }// catch
          break;
    
        default:
          // update sessionStorage
          sessionStorage.setItem(storage_str, "false");
          try {
            // update VIEWER_DATA
            VIEWER_DATA.DEMO[`${entry}`] = false;
          } catch (error) {
            console.error('[settings.js] VIEWER_DATA.DEMO issue');
          }// catch
          break;
      }// switch
      
    });// forEach

    

}// demo_update

/*
  import { true_target } from '../../tools/true_target';

  // make sure im glowing the correct element
  let t_target = true_target(ev.target, "ListArea", "class");// my_a_wrap

  // disable context menu for hold mode
  ev.target.addEventListener("contextmenu", function (evt) {
    evt.preventDefault();
    return false;
  }, { once: true });

  // do the demo check
  demo(t_target, () => {
    hold_up(ev, `_${aName}`, trigger_move, { state: s.app_state, "title": tVar.data1, "prefix": tVar.view_prefix })
  });
*/

/*
  // a unique class string example
  onClick={(e) => { e.persist(); demo(".add_info",() => {
    add_info_callout(e);
  });}}
*/