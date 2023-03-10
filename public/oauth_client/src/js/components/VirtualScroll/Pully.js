  import /*React,*/ {memo, useState, useEffect, useRef, useMemo} from 'react';
  const {class_maker} = require('../../tools/class_maker');
  const display_console = false;
  require('./Pully.scss');


  /**
   * @module Pully
   * @category List
   * @subcategory scroll
   * @desc pully component
   * @param {object} data
   * @param {number} data.iUN individual unique number - helps identify and set keys when needed
   * @param {object} data.container useRef
   * @param {object} data.refresh refresh callback
   * @param {number} refresh.timer display loader delay in milliseconds
   * @param {boolean} wait continue to refresh component or dont update state and wait for component to be unmounted
   * @see [VirtualScroll]{@link module:VirtualScroll}
   */

  /**
   * @file
   */

  const Pully = (props) => {

    const iUN_ref = useRef(Math.round(Math.random() * 10000));

    const {
      iUN = iUN_ref.current,
      container,
      refresh = {timer: 4000, wait: false},
      timer = refresh.timer,
      wait = refresh.wait
    } = props.data;


    const pullyRef = useRef();
    // const [panHeight, setPanHeight] = useState(0);
    const [state, setState] = useState({panHeight:0, panRotate:0});
    const [showLoader, setShowLoader] = useState(false);
    const interacting = useRef(false);
    const panning = useRef(false);
    const refreshing = useRef(false);
    const loading = useRef(false);
    const close_timer = useRef();
    const shrinky = useRef();

    const reset_pully = () => {

      if( refreshing.current && wait == true) return;// if wait the component will unmount - don't update any more state variables

      interacting.current = false;
      panning.current = false;
      refreshing.current = false;
      loading.current = false;
      // setPanHeight(0);
      setState({panHeight:0, panRotate:0});
      setShowLoader(false);
    }


    /**
     * @callback can_enabled
     * @param  {object} rec hamerjs manager object
     * @param  {object} input hammerjs event object equivalent
     * @param {number} input.direction number code to determine the pan direction (16 = down)
     * @return {boolean} is pan enabled?
     */
    const can_enabled = (rec, input) => {

      let scrollTop = container.current.scrollTop;//props.data.scrollTop

      if(typeof rec == "undefined" || typeof input == "undefined") return false;
      if(display_console || false) console.warn(`[pan] rec`,rec);
      if(display_console || false) console.warn(`[pan] input`,input);
      if(display_console || false) console.warn(`[Pully] scrollTop`,scrollTop);
      if(display_console || false) console.warn(`[Pully] panning`,panning.current);

      let dir = (input.direction == 16) ? "down" : "up";

      /**
       * @var enable_it
       * @desc determine if pan should be enabled
       * @type {boolean}
       * @example
       *  // if not panning and at the top of the scoll and dir is down,
       * !panning.current && scrollTop < 10 && dir == "down"
       * //if panning and scrollTop is less than 10 and direction is up or down
       * // idk how the next 2 are useful (this is the next day docs) but if i remove them it janks
       * panning.current && scrollTop < 10 && dir == "down" ||
       * // modified to
       * panning.current && dir == "down" ||
       */
      let enable_it = (!panning.current && scrollTop < 10 && dir == "down" ||
      panning.current && dir == "down" ||
      panning.current && dir == "up"
      ) ? true : false;

      if(enable_it == false){
        // rec.manager.touchAction.actions = "none";
        if(display_console || false) console.warn(`[Pully] disabling pan `,dir);
        unpan();
        container.current.style.touchAction = "auto";
        rec.manager.set({touchAction:"auto"});
      }else {
        if(display_console || false) console.warn(`[Pully] enabling pan `,dir);
        // rec.manager.touchAction.actions = "pan-x";
        container.current.style.touchAction = "pan-x";
        rec.manager.set({touchAction:"pan-x"});
      }// else

      return enable_it;
    }// can_enabled

    let cE = can_enabled.bind("",props);

    const pan_display = function (e,whaa) {

      let me = window.event;
      // let _this = this;
      // let panHeight = this;

      // if(typeof this == "undefined" || typeof panHeight == "undefined") return;
      // if(me.type == "pointerup") return;// fixes the extra pan event occuring when release the mouse btn
      if(display_console || false) console.warn(`[Pully] event =`,me);
      let end_event = (me.pointerType.includes("touch")) ? "touchend" : "mouseup";
      if(!panning.current) document.addEventListener(end_event,unpan,{once:true});// setting panning.current during the false state helps me not add this multiple times with each movement

      interacting.current = true;
      panning.current = true;
      let dir = (e.direction == 16) ? "down" : "up";

      if(display_console || false) console.warn(`[Pully] scrollTop`,props.data.scrollTop);
      if(display_console || false) console.warn(`[Pully] panning...`,dir);
      if(display_console || false) console.warn(`[Pully] deltaY = `,e.deltaY);

      let maxY = 100;
      let minY = 0;

      let rotateMin = 0;
      let rotateMax = 540;// half is 270



      // let nextY = e.deltaY < maxY ? e.deltaY : maxY;
      // let nextY;
      // switch (dir) {
      //   case "down":
      //       // nextY = panHeight < maxY ? panHeight + 1 : maxY;
      //       nextY = e.deltaY < maxY ? e.deltaY : maxY;
      //     break;
      //   default:
      //       // nextY = panHeight > minY ? panHeight - 1 : minY;
      // }

      /**
       * the delta is used to increment the height - i tried to just add to the height but there were issus with the height useRef and hammer bind
       * @type {number}
       */
      let nextY = e.deltaY > maxY ? maxY : e.deltaY < minY ? minY : e.deltaY;

      /**
       * @member nextRotate
       * @desc
       * once i figure out nextY, what % of the max is this number?
       * then take this percentage and times it by the rotate max to us the same percentage as the rotate degree
       * @type {number}
       */
      let nextRotate = (nextY / maxY) * rotateMax;

      if(display_console || false) console.warn(`[Pully] nextY = `,nextY);

      if(nextY == maxY){
        refreshing.current = true;
      }else{
        refreshing.current = false;
      }

      if(display_console || false) console.warn(`[Pully] refreshing = `,refreshing.current);

      window.requestAnimationFrame(() => {
        setState((prev) => {
          return {panHeight: nextY, panRotate: nextRotate}
        });
      })
    }//pan_display

    /**
     * cosmetic function used only as a delay placeholder - it servers no other purpose
     * @return {Promise} [description]
     */
    const delay_display = async () => {
      //shrink back to shrink css display
      let ms = timer;
      // shrinky.current = await setTimeout(function(){
      //   // wait a few
      //   return true;
      // }, 3000);// half a second? nope too fast

      return new Promise(resolve => shrinky.current = setTimeout(resolve, ms));
    }

    const pull_me = async () => {
      // this run when pully is fully extended and auto resets to the start position
      if(refreshing.current /*&& typeof refresh.callback != "undefined"*/){
        loading.current = true;
        setShowLoader(true);
        if(display_console || false) console.warn(`[Pully] running refresh callback`);
        await delay_display()
        refresh.callback();
        reset_pully();// Arc dismounts Pully so running this after the callback creates a memory leak
      }else{
        // this runs when pully is manually reset to the start position by the user
        if(display_console || false) console.warn(`[Pully] pull_me running reset_pully`);// this was the memory leak
        reset_pully();
      }
    }// pull_me

    useEffect(() => {
      if(display_console || false) console.warn(`[Pully] pullyRef = `,pullyRef);
      if(display_console || false) console.warn(`[Pully] container = `,container);

      let hammertime;
      window.hammertime = hammertime = new Hammer.Manager(container.current,{domEvents:true});//
      // set the directions
      hammertime.add(new Hammer.Pan({enable:can_enabled}));

      hammertime.get("pan").set({direction: Hammer.DIRECTION_VERTICAL});//[Hammer.DIRECTION_UP,Hammer.DIRECTION_DOWN] // somehow this direction array not longer works

      // hammertime.on("panup, pandown", Hammer.bindFn(pan_display,panHeight),false);
      hammertime.on("panup pandown",pan_display);

      hammertime.on("panend",unpan);

      return () => {
        // cleanup
        if(hammertime){
          hammertime.destroy();
        }

        if (typeof close_timer.current != "undefined") {
          clearTimeout(close_timer.current);
        }

        if (typeof shrinky.current != "undefined") {
          clearTimeout(shrinky.current);
        }
      }// return

    },[]);

    /**
     * triggers during panend/ and touchend, mouseup but it sometimes fails to be detected so close_timer timeout is used as a catch all
     * @return {void}
     */
    const unpan = () => {
      if(display_console || false) console.warn(`[Pully] panning ending...`);
      if(refreshing.current) return;// don't do anything if were in refreshing mode
      panning.current = false;
      // pullyRef.current.style.height = "0px";
      // hammertime.set({touchAction:"auto"})// fails
      // setPanHeight(0);
      setState({panHeight:0, panRotate:0});
    }

    if(typeof close_timer.current != "undefined") clearTimeout(close_timer.current);

    if(interacting.current == true && loading.current == false){
      // this timeout makes sure the the panning window doesn't hang open
      close_timer.current = setTimeout(function(){
        pull_me();
      }, 1000);// half a second? nope too fast
    }

    if(display_console || false) console.warn(`[Pully] rendering...`);

    return <div className={`${class_maker({name:"pully",main:"pull_to_refresh",iUN})} ${showLoader ? "shrink" : ""}`} ref={pullyRef} style={{height:`${state.panHeight}px`}}>
      {!showLoader ? (<div className={`pull-arrow d3-ico icon-spinner11 ${refreshing.current ? "envy heartbeat" : ""}`} style={{transform:`rotateZ(${state.panRotate}deg)`}}></div>) : null}
      {showLoader ? (
        <div className="pull-loader">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      ) : null}
    </div>;
  }// Pully

  export default React.memo(Pully);
