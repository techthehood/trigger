import { useRef, useEffect, useState } from 'react';
const { exists } = require('./exists');

const display_console = false;

const useDrag = ({
  mainDrag,
  mainContain,
  pos,
  update,
}) => {

  let dragRect = useRef();
  let mainContainRect = useRef();
  let panning = useRef(false);
  let xOffset = useRef();
  let limits = useRef();
  let yOffset = useRef();

  // const [lastX, setLastX] = useState(0);
  // const [lastY, setLastY] = useState(0);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const stale_tracking_x = useRef(0);
  const stale_tracking_y = useRef(0);


  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  // const [thirdRender, setThirdRender] = useState(false);

  useEffect(() => {
    // let mainDrag = document.querySelector(".paper_icon");//mindsEye
    // console.warn("[Paper] hammertime (5)");
    let hammertime;

    if (display_console || false) console.warn(`[useDrag] mainDrag = `, mainDrag.current);

    if (mainDrag.current) {
      // let tree = document.querySelector(".mindsEye");


      hammertime = new Hammer(mainDrag.current, { domEvents: true });
      // hammertime.get("pan").set({enable: true, velocityX: 0.00000002, velocityY: 0.00000002});
      hammertime.get("pan").set({ direction: Hammer.DIRECTION_ALL });

      // i needed way less calculations - created an animation lag. so im setting static values out here.
      dragRect.current = mainDrag.current.getBoundingClientRect();

      if (mainContain.current.getBoundingClientRect() /*&& mainContain.current.classList.contains("block")*/) {
        // fix for mainContain rect data sets to zero when not in store.show and "block" class
        // only set the current when visible in block mode - may not need resize, but i may need it idk
        mainContainRect.current = mainContain.current.getBoundingClientRect();
      }

      // let limitRect = mainContain.current.getBoundingClientRect();
      if (exists(mainContainRect.current)) {
        // i still need to control the resize

        let limitRect = mainContainRect.current;

        let targetRadius = dragRect.current.height / 2;
        let maxX = limitRect.width - dragRect.current.height / 2; //targetRadius;
        let minX = targetRadius;
        let maxY = limitRect.height - dragRect.current.height / 2; //targetRadius;
        let minY = targetRadius;
        limits.current = { maxX, minX, maxY, minY };
        // items pan positions
        if (display_console || false) console.warn(`[pan] limits current = `, JSON.stringify(limits.current));

        hammertime.on("pan", (e) => {
          let me = window.event;
          if (me.type == "pointerup") return;// fixes the extra pan event occuring when release the mouse btn

          // i moved this down below the return so i don't have to click the icon twice to get a toggle action
          panning.current = true;
          // console.warn("[pan] deltaX", e.deltaX);
          // console.warn("[pan] deltaY", e.deltaY);

          // deltaX and deltaY think (0,0) is where the pan starts
          // deltaX and deltaY is how far you have moved the pan from it's original position
          if (display_console || false) console.warn(`[pan] pan positions \n deltaX = ${e.deltaX}, \n deltaY = ${e.deltaY}`);

          // mouse positions
          // console.warn("[pan] clientX", me.clientX);
          // console.warn("[pan] clientY", me.clientY);
          // console.warn('[pan] event', window.event);

          // clientX and clientY (0,0) is at the top left corner of an element the offset tells us how far away the object initially is from (0,0)
          if (display_console || false) console.warn(`[pan] mouse positions \n clientX = ${me.clientX}, \n clientY = ${me.clientY}`);

          if (!xOffset.current) {
            // this offset is only being set once.
            xOffset.current = me.clientX - (lastX.current + e.deltaX);
            if (display_console || false) console.warn(`[pan] \n clientX = ${me.clientX} \n lastX = ${lastX.current} \n deltaX = ${e.deltaX} \n offsetX = `, xOffset.current);
            if (display_console || false) console.warn("[pan] xOffset", xOffset.current);
            yOffset.current = me.clientY - (lastY.current + e.deltaY);
            // console.warn("[pan] yOffset", yOffset.current);
          }

          // i can get the icon width and height from dragRect.current

          // i want to use the modal window as my movement limit

          // i need to track the resize so the limits stay valid

          // on resize the icon needs to be responsive - track a value of realX and realY which is
          // icons true distance from zero edges (mouse pos)

          // console.log("[pan] gesture deltaX", e.gesture.deltaX);
          // paperStore.x = -1 * e.deltaX;// remove css scroll styling and it works

          let nextX = lastX.current + e.deltaX;
          if (display_console || false) console.warn(`[pan] calculate nextX \n lastX = ${lastX.current} \n deltaX = ${e.deltaX} \n nextX = `, nextX);

          // let trueX = nextX + xOffset.current;

          // what does the xoffset have to do with helping me set my limits?
          // the xoffset helps define where the real edge is based on how far the object already is from the origin
          let xMax = limits.current.maxX - xOffset.current;
          // let xMax = limits.current.maxX;// no offset
          let xMin = limits.current.minX - xOffset.current;
          // let xMin = limits.current.minX;// no offset

          // [pan] .x calculation (w/o offset) nextX (-10) > xMax (600) ? xMax : nextX < xMin (30) ? xMin : nextX
          // so this results in the object being set to 30 (deltaX) which is 30 px to the right of deltaX origin

          //[pan] .x calculation (with offset) nextX (-10) > xMax (60.6666259765625) ? xMax : nextX < xMin (-509.3333740234375) ? xMin : nextX
          // this tells me 2 things, its 60px from the max x edge of the rectangle so the object can travel only 60 more px to the right
          // its also 509 px from the left edge so it can go back (negative #) - 509 more px to the left before it is stopped

          let nextY = lastY.current + e.deltaY;
          // let trueY = nextY + yOffset.current;
          let yMax = limits.current.maxY - yOffset.current;
          let yMin = limits.current.minY - yOffset.current

          // paperStore.x = lastX + e.deltaX;
          if (display_console || false) console.warn(`[pan] .x calculation \n nextX (${nextX}) > xMax (${xMax}) ? xMax : \n nextX < xMin (${xMin}) ? xMin : nextX`);
          let ready_x = (nextX > xMax) ? xMax : (nextX < xMin) ? xMin : nextX;
          stale_tracking_x.current = ready_x;
          setX(ready_x);
          // paperStore.x = (trueX > limits.current.maxX) ? limits.current.maxX - xOffset.current :
          // (trueX < limits.current.minX) ? limits.current.minX - xOffset.current : nextX;
          // paperStore.x = (trueX > maxX || trueX < minX) ? paperStore.lastX : nextX;
          // console.warn("[pan] paperStoreX", paperStore.x);

          // paperStore.y = lastY + e.deltaY;
          let ready_y = (nextY > yMax) ? yMax : (nextY < yMin) ? yMin : nextY;
          stale_tracking_y.current = ready_y;
          setY(ready_y);
          // paperStore.y = (trueY > limits.current.maxY) ? limits.current.maxY - yOffset.current :
          // (trueY < limits.current.minY) ? limits.current.minY - yOffset.current : nextY;
          // paperStore.y = (trueY > maxY || trueY < minY) ? lastY : nextY;

          // console.warn("[pan] paperStoreY", paperStore.y);
          // console.log("[pan] event", e);

          e.preventDefault();
        });

        hammertime.on("panend", (e) => {
          // console.log("[pan] deltaX", e.deltaX);
          // console.log("[pan] gesture deltaX", e.gesture.deltaX);
          // paperStore.x = -1 * e.deltaX;// remove css scroll styling and it works
          // setLastX(x); // e.deltaX;
          if (display_console || false) console.warn(`[Paper] panend x(${x}) y(${y})`);
          lastX.current = stale_tracking_x.current; //x;
          // console.warn("[pan] paperStore lastX", paperStore.lastX);
          // console.log("[pan] deltaY", e.deltaY);
          // setLastY(y);// e.deltaY;
          lastY.current = stale_tracking_y.current; //y;

          if(display_console || false) console.warn("[Paper] panend", e);
          if (e.pointerType == "touch") {
            // fix for mouseup issue
            panning.current = false;
          }// if
          // console.warn("[pan] paperStore lastY", lastY);
          // console.log("[pan] event", e);
          e.preventDefault();
        });

      }
    }// if mainDrag.current

    // if (thirdRender == false) {
    //   setThirdRender(true);
    // }

    return () => {
      // cleanup
      if(display_console || false) console.error(`[useDrag] unmounting`)
      if (hammertime) {
        hammertime.destroy();
      }
    }// return

  }, [/*thirdRender, mainDrag.current,*/ update]); // useEffect

  return [x, y];
}// useDrag

export default useDrag;