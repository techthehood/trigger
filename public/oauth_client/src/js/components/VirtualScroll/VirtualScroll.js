  import /*React,*/ {memo, useState, useEffect, useRef, useMemo} from 'react';
  import Pully from './Pully';
  import Loader from '../Loader/Loader';
  import { obj_exists } from '../../tools/exists';
  const {class_maker} = require('../../tools/class_maker');
  require("./VirtualScroll.scss");

  const display_console = false;

  const useScrollAware = ({has_dynamic_height, dynamic_height, flip = false}) => {
    // custom hook
    const [scrollTop, setScrollTop] = useState(0);
    const viewport_ref = useRef();
    const last_fixed_top = useRef(0);
    const last_top = useRef(0);
    const dynamic_node = useRef(0);
    const scrollBottom = useRef(0);
    const last_dir = useRef("bottom");
    const dh_ref = useRef([0]);//0
    dh_ref.current = dynamic_height;

    if(display_console || false) console.debug(`[useScrollAware] dynamic_height =`,dynamic_height);

    const find_position = (dH,fxd) => {
      // binary search for the node's position index
      return binarySearch(dH, fxd)
    }// find_position

    const binarySearch = (array, target) => {
      let startIndex = 0;
      let endIndex = array.length - 1;
      let middleIndex;
      let test_console = false;
      let iterations = 0;
      let limit = 200;

      if(display_console || test_console || false) console.debug(`\narray = ` + array);

      if(array.length < 2 || target == 0) return 0;// avoid an infinite loop with a zero array

      while (startIndex <= endIndex && iterations < limit) {
        // there is an iteration limit that can limit item detection to a lesser index
        middleIndex = Math.floor((startIndex + endIndex) / 2);

        if(target == array[middleIndex]) {
          if(display_console || test_console || false) console.debug(`\nTarget was found at index ` + middleIndex);
          middleIndex;
          break;
        }
        else if(target > array[middleIndex]) {
          if(display_console || test_console || false) console.debug(`\nSearching the right side of Array of middleIndex ${middleIndex} \n target ${target} > ${array[middleIndex]}`)
          startIndex = middleIndex + 1;
        }
        else if(target < array[middleIndex]) {
          if(display_console || test_console || false) console.debug(`\nSearching the left side of array of middleIndex ${middleIndex} \n target ${target} < ${array[middleIndex]}`)
          endIndex = middleIndex - 1;
        }
        else if (startIndex == endIndex){
          // nothing to see here
          break;
        }
        else {
          if(display_console || test_console || false) console.debug("Not Found this loop iteration. Looping another iteration.")
        }

        iterations++;
      }// while

      if (display_console || test_console || false) console.debug("[VirtualScroll] binarySearch: iterations = ", iterations);

      if (iterations >= limit){
        console.error(`[VirtualScroll] binarySearch: while was stuck in an infinite loop`);
        if (display_console || test_console || false) {
          console.debug([`[VirtualScroll] binarySearch: \n `, 
          `Target = ${target} \n`, 
            `middleIndex = ${middleIndex} \n`, 
            `startIndex = ${startIndex} \n`,
            `endIndex = ${endIndex}`,
            `array = ${array}`
          ].join());
        }

      }// if

      let final_index = (target < 0 || middleIndex <= 0) ? 0 : (target >= array[middleIndex]) ? middleIndex : middleIndex - 1;
      if(display_console || test_console || false) console.debug(`Target ${target} value not found in array ${array}. middleIndex is ${final_index} \n iterations = ${iterations}`);

      // fix for -1 NaN problem in find_visible
      return final_index;
    }// binarySearch
    // if startIndex is 1 and endIndex is 10 then middleIndex will be 5. if target is less than 5 then startIndex 
    // remains 1 and endIndex will then change to 4 and middle index will be 2 and then the checks continue

    const onScroll = (e,{flip}) =>
      requestAnimationFrame(() => {
        // why use requestAnimationFrame? what are the benefits?

        // most of this code is unnecessary - the requestAnimationFrame runs at 60fps and isn't limited by any offset
        // i try to use to limit the number of calculations
        if (display_console || false) console.debug(`[scrollAware] onScroll flip`, flip);


        let num = e.target.scrollTop;// the amount of pixels the overflow is over the visible top threshold
        let fixed = num.toFixed();// shaves off all the decimal places
        let offset = has_dynamic_height ? 0 : 10;//??? - this looks like it limits the rerender increment to every 10 px instead of every pixel change
        let last = last_top.current;// helps determine the scroll direction based on the number +/- since last scroll
        let last_fixed = Number(last_fixed_top.current);// shows change of top dir every 10 pxs (offset)
        let adding_to = (fixed > last) ? "bottom" : "top";// last shows change of dir down to the px

        last_top.current = fixed;
        // console.warn(`[onScroll] adding_to ${adding_to}`)
        if(/*fixed > last + offset*/ adding_to == "bottom" || fixed < last_fixed - offset){
          // i wonder why im not doing increments of 10 (offset) for scrolling down?
          // console.warn(`[onScroll] scrollTop = ${last}`)
          // console.warn(`[onScroll] lf + o ${last_fixed + offset} < f ${fixed} > lf - o  ${last_fixed - offset} \n lf = last_fixed o = offset and f = fixed`);
          if(flip) scrollBottom.current = getScrollBottom(e.target,true);
          if (display_console || false) console.debug(`[scrollAware] scrollBottom = ${scrollBottom.current}`);

          if(has_dynamic_height){
            if(dh_ref.current.length < 2){
              dynamic_node.current = 0;
            }else{
              let test_height = flip ? scrollBottom.current : fixed;
              dynamic_node.current = find_position(dh_ref.current, fixed);// test_height
            }
          }// if

          if(adding_to != last_dir.current && false){
            // added to help find the src of the jank in the scroll - ill keep it though
            if(display_console || false) console.debug(`[scrollAware] dir: ${adding_to}`);
            last_dir.current = adding_to;
          }// if


          last_fixed_top.current = fixed;

          if (display_console || false) console.debug(`[scrollAware] scrollTop = ${fixed}`);
          setScrollTop(fixed);
        }
        // scroll top tells how far the scrollable content container is
        // from the top of the scrolling viewport so when items 0 and 1 are out of sight scrollTop is 60
      });

    useEffect(() => {
      const scrollContainer = viewport_ref.current;

      setScrollTop(scrollContainer.scrollTop);
      scrollContainer.addEventListener("scroll", (e) => {
        onScroll(e,{flip})
      });

      // cleanup fn
      return () => scrollContainer.removeEventListener("scroll", onScroll);
    }, []);

    return [scrollTop, viewport_ref, dynamic_node.current, scrollBottom.current];
  };// useScrollAware

  /**
   * @module VirtualScroll
   * @category List
   * @subcategory scroll
   * @desc VirtualScroll component
   * @param {string} name,
   * @param {string} [prefix = ""]
   * @param {number} [iUN = Math.round(Math.random() * 10000)]
   * @param {object} Item, this is the mapping template for the list items
   * @param {number} itemCount the list item data array count - used to populate visible_area height
   * @param {number} height scrollcontainer height - this height comes out to 300,000px 30 * 10,000
   * @param {number} childHeight, item height
   * @param {number} [renderAhead = 3] i believe i have seen this labeled as padding - this will render 20 items above * below
   * @param {number} [padding = 0] padding between each item
   * @param {boolean} [hide_scroll = false]
   * @param {object} observer useRef
   * @param {boolean} [loading = false]
   * @param {boolean} [has_more = false]
   * @param {boolean} [position = 0]
   * @param {callback} save_position stores and references the lists scroll position in the store
   * @param {boolean} [stats = true] ? dev var used to show stats during renders
   * @param {callback} refresh pull to refresh callback that triggers the Pully component
   * @requires Pully
   * @see [ReactListItems]{@link module:ReactListItems~refresh_binder}
   * @see [Arc iconWall_callback]{@link module:Arc~iconWall_callback}
   */

  /**
   * @file
   */

  const VirtualScroll = React.memo(({
  // const VirtualScroll = ({
    iUN:props_iUN,
    name,
    prefix = "",
    Item,/*this is the mapping template for the list items*/
    itemCount,
    childHeight,/*item height*/
    height,/*scrollcontainer height - this height comes out to 300,000px 30 * 10,000*/
    renderAhead = 3,/*i believe i have seen this labeled as padding - this will render 20 items above &/or below*/
    padding = 0,/*padding has an opposite effect.  more makes the sensor trigger further into the next item*/
    // too much negative padding makes items cut off at the bottom of the list
    hide_scroll = false,
    observer,
    loading = false,
    has_more = false,
    position = 0,
    save_position,
    stats = false,//allows certain console. to be displayed
    refresh,
    show_loader = true,
    has_dynamic_height = false,
    dynamic_height = [0],
    dir = "forward",
    skip_position = false,
    // render_nbr,
    data_ref = {}
  }) => {

  const iUN_ref = useRef(Math.round(Math.random() * 10000));
  const iUN = props_iUN || iUN_ref.current;

     /**
      * @callback useScrollAware
      * @desc
      * idk what the significance of scrollTop - top of what? <br>
      * - scrollTop is how far the top of the internal <br>
      * scroll element is from the scroll viewport <br>
      * @return {object} scrolltop, ref
      */
    let flip = dir != "forward" ? true : false;
    const [scrollTop, viewport_ref, dynamic_node, scrollBottom] = useScrollAware({has_dynamic_height, dynamic_height, flip});// preps scroll height and sends a ref to use in scroll event listener
    const container = useRef();

    if(typeof save_position == "function"){
      save_position(scrollTop);
    }//if

    const hideScroll = (hide_scroll) ? "hide-scroll" : "";
    const last_request_section = useRef(0);

    // i get this - how to set the content containers


    //childHeight = childHeight + padding;// WARN: this is causing the jank!!!!!!
    if (obj_exists(viewport_ref,"current")){
      data_ref.viewport = viewport_ref;
    }// if



    let use_height = (has_dynamic_height) ? dynamic_height[dynamic_height.length - 1] : (itemCount * childHeight);
    const totalHeight = use_height + padding;// can i give it padding?
    const viewport_height = Math.min(height, totalHeight);//(totalHeight < height) ? totalHeight : height;


    // Math.floor keeps the decimal places out of the calculation
    // what does startNode do?
    // let startNode = Math.floor(scrollTop / childHeight) - renderAhead;// how will i do this dynamically?
    // this will be my dynamic setup
    let startNode = (has_dynamic_height) ? dynamic_node - renderAhead : Math.floor(scrollTop / childHeight) - renderAhead;

    if(display_console || false){
      let toov = (has_dynamic_height) ? dynamic_node : Math.floor(scrollTop / childHeight);
      let sn_calc = [
        `[startNode] calc 1 \n `,
        `top out-of-view indexes  ${(has_dynamic_height) ? "" : `= Math.floor(scrollTop (${scrollTop}) / childHeight (${childHeight}))`} = ${toov}\n`,
        `\ntop out-of-view indexes (${toov}) - renderAhead (${renderAhead}) = startNode (${startNode})`
      ].join("");
      console.warn(sn_calc);
    }// if

    if(display_console || false){
      let toov = Math.floor(scrollTop / childHeight);
      let vis_ndx = startNode + renderAhead + 1;
      let sn_stats = [
        `[startNode] stats \n `,
        `startNode = ${startNode} ${startNode < 0 ? `or ${Math.max(0,startNode - 1)}` : ""}`,
        `\n${toov} total top out-of-view indexes \n`,
        `${Math.max(0,startNode)} indexes not being rendered\n`,
        startNode - 1 < 0 ? "" : (startNode - 1 == 0) ? `index 0 not being rendered\n` : `index 0 - ${Math.max(0,startNode - 1)} not being rendered\n`,
        startNode < 0 ? "" : `index ${startNode} - ${(startNode + renderAhead) - 1} being top rendered ahead\n`,
        `visible index = ${(startNode + renderAhead + 1) - 1}\n`,
        `indexes ${vis_ndx - 1} - ${(vis_ndx - 1) + 3} are potentially visible\n`,
        `\n(note: more accurate padding creates a more accurate stat line)\n`
      ].join("");
      console.debug(sn_stats);
    }// if

    let topNode = startNode;//Math.floor(scrollTop / childHeight);
    if(display_console || false) console.debug("[topNode] calc ",topNode);
    /**
     * @member startNode
     * @desc
     * this math max keeps the first x (renderAhead || 20) set as a zero (instead of negative nbrs) startNode because there isn't more to put overhead
     * than the 20 initial items. once the (renderAhead || 20) gets overhead the count starts to move.
     * if renderAhead hasn't been reached this number by subracting renderAhead could become a negative number
     */
    startNode = Math.max(0, startNode);
    if(display_console || false) console.debug("[startNode] calc 2",startNode);

    // calculates how many nodes can fit into the viewport + doubles renderAhead
    // let visibleNodeCount = Math.ceil(viewport_height / childHeight) + 2 * renderAhead;/* 300 / 30 = 10 + 2*20 = 50 */
    let visibleNodeCount = (has_dynamic_height) ? (find_visible({viewport_height, dynamic_node, dynamic_height})) + 2 * renderAhead :
    Math.ceil(viewport_height / childHeight) + 2 * renderAhead;

    // console.log("[visible node count] calc 1",visibleNodeCount);

    /**
     * @member visibleNodeCount
     * @desc
     * this will return the lowest number passed to it. which effectly means that it will stop when the nbr
     * reaches a certain limit (by the calculation countdown that is happening). <br>
     * what happens when the calculation countdown goes under the set nbr? <br>
     * eventually the visible node count will fall below the staic number, coupled with the start node
     * it will force no more nodes to be created
     *
     * if itemCount is less than the startNode maybe the data has started over. go with the numbers we have. (do we reset the scrollTop?)
     */
    visibleNodeCount = (itemCount < startNode) ? itemCount : Math.min(itemCount - startNode, visibleNodeCount);
    if(itemCount < startNode){
      // protects agains restarting without the proper restarting processes
      // this happens when itemCount is a negative #
      startNode = 0;
    }

    // console.log(`[itemCount ${itemCount} - startNode ${startNode}]`,itemCount - startNode);

    // console.log("[visible node count] calc 2",visibleNodeCount);

    // const offsetY = startNode * childHeight;// startNode/topNode // pre dynamic offset
    // in dynamic_height the offset would be the progressive increase in height already in the dynamic_height array
    const offsetY = (has_dynamic_height) ? dynamic_height[startNode] : startNode * childHeight;// startNode/topNode


    if(display_console || false) console.debug(`[offsetY] startNode ${startNode} * childHeight ${childHeight} = offsetY`,offsetY);

    useEffect(() => {
      // NOTE: in most cases the list_display in Views isn't active unless the list has data (no empty) 
      // so this will be safe to run once at the start because there will be a value
      if (skip_position) return;

      if(display_console || false) console.debug(`[VirtualScroll] position = `, position);
      viewport_ref.current.scrollTo(0,position);// this works (otherwise i would use an init boolean in its own useEffect)
    },[])

    useEffect(() => {
      // stats no longer needed, im no longer using this to trigger restocking
      if(!stats) return;
      // console.warn("[viewport] in viewport",viewport_height / childHeight);
      // console.warn("[hidden count]",2 * renderAhead);
      let vh_str =  [`[visible node count] calc \n`,
      ` \n viewport_height (${viewport_height}) / `,
        `childHeight (${childHeight})) + 2 * renderAhead (${renderAhead}) = `,
        `${Math.ceil(viewport_height / childHeight) + 2 * renderAhead} \n or \n `,
        `itemCount (${itemCount}) - startNode/topNode (${startNode}) = ${itemCount - startNode} (possible remaining nodes) \n`,
        `\n actual visible node count = ${visibleNodeCount} (the min #)\n `,
        `(# needs to be below first render #) \n`,
        `\n after scrolltop reaches the height of ${renderAhead} (renderAhead) items,`,
        ` \n the startNode/topNode index (${startNode}) will change and items will start to be removed \n`,
        ].join("");
      if(display_console || false) console.debug(vh_str);
      let fRender = [`[first render] ${itemCount - renderAhead}`,
      ` render ahead by ${renderAhead} `,
      ` \n (observer triggers at this index)`].join("");
      if(display_console || false) console.warn(fRender);
      if(display_console || false) console.warn("[vScroll] viewport ref = ",viewport_ref.current);
      // i want to set this to a scroll position
      // get the scroll top
    },[]); // to see stats, change stat var to true and remove the useEffect empty array ,[] and change display_console to true

    // useEffect((params) => {
    //   if (display_console || false) console.debug('[VirtualScroll] UEF render_nbr', render_nbr);
    // })

    // GOTCHA: Error - VirtualScroll.js Uncaught RangeError: Invalid array length
    // im going to try to fix this error.

    if(visibleNodeCount < 1 || isNaN(visibleNodeCount)){
      if(display_console || false) console.warn('[VirtualScroll] WARNING: visibleNodeCount.length',visibleNodeCount);
      // return null;
      visibleNodeCount = 0;
    };

    /**
     * @member visibleChildren
     * @desc
     * why use memo here? - oh yeah, this will only change when the properties in the array below change <br>
     * item changes when its index changes. its index property changes if its index is changed its alright
     * for it to be changed here - i think it will be disgarded i don't think it is reused and sent to top/bottom
     */
    const visibleChildren = React.useMemo(
      () => {
          if(display_console || false) console.debug(`[VirtualScroll] visibleNodeCount`,visibleNodeCount);
          return new Array(visibleNodeCount)
            .fill(null)
            .map((_, index) => {
              // do something
              // the startNode is the 1st index that should be visibly rendered - scrollTop ndx - renderahead
              // the tru_ndx is the actual index to render counted from the "startNode" index
              let tru_ndx = index + startNode;
              // console.warn("[map] index",index);
              // if (display_console || false) console.debug(`[map] index (${index}) startNode (${startNode})  tru_index`,tru_ndx);
              if (display_console || false) console.debug(`[map] tru_index`, tru_ndx);

              // while scrolling the tru_ndx stays the same until it eats up the render ahead distance

              // if(restock && tru_ndx > itemCount - renderAhead && tru_ndx > last_request_section.current){
              //   // run this request once per section
              //   last_request_section.current = itemCount;
              //   // console.warn(`[rendered at] itemCount ${itemCount} - renderAhead ${renderAhead}`, itemCount - renderAhead);
              //   // console.warn("running mock request callout");
              //   // console.warn("[visibleChildren] itemCount",itemCount);
              //   restock();
              // }
              return(
                <Item key={tru_ndx} index={tru_ndx} />
              );
          })
        },
        [startNode, visibleNodeCount, Item]

    );
    // keep researching the behind the scenes to the magic or dom-recycling 'supposedly' being used here
    // (my assumption, maybe it isn't)

    let pully = null;

    if(typeof refresh != "undefined"){
      /**
       * @var pully-data
       * @desc pully data object
       * @prop {object} container useRef
       * @prop {callback} refresh refresh callback
       * @requires Pully
       * @see [ReactListItems]{@link module:ReactListItems~refresh_binder}
       * @see [Arc iconWall_callback]{@link module:Arc~iconWall_callback}
       * @type {Object}
       */
      let pully_data = {container: viewport_ref, refresh};

      pully = <Pully data={pully_data}/>
    }

    let loader_display = (
      <Loader name={name} prefix={prefix} iUN={iUN} ref={observer} type={"dots"}
        onClick={(e) => {
          if (display_console || true) console.warn("[VirtualScroll] Loader clicked!");
          observer(e.target,true);
      }}
      data-observer="loader" variants="vScroll2" />
    );

    const force_scroll = (botPos) => {
      let new_scroll_top = viewport_ref.current.scrollHeight - botPos;
      if (display_console || false) console.debug("[VirtualScroll] new_scroll_top", new_scroll_top);
      viewport_ref.current.scrollTo(0, new_scroll_top);
    }// force_scroll

    data_ref.force_scroll = force_scroll;
    data_ref.getScrollBottom = getScrollBottom;


    if (display_console || false) console.warn("[VirtualScroll] rerendering...");

    // if (display_console || false) console.debug('[VirtualScroll] RNDR render_nbr', render_nbr);

    // if((display_console || true) && has_dynamic_height) console.warn(`[VirtualScroll] dynamic_height = `, dynamic_height);
    // if((display_console || true) && has_dynamic_height) console.warn(`[VirtualScroll] totalHeight = `, totalHeight);
    // how does it know to move the item to the bottom?
    return (
      <>
      {pully}
      <div className={`${class_maker({prefix,name,main:"viewport",iUN})} VirtualScroll ${hideScroll} `}
        style={{ height, overflow: "auto" }}
        data-comp={`VirtualScroll`}
        ref={viewport_ref}>
        <div
          className={class_maker({prefix,name,main:"visible_area",iUN})/*the former viewport*/}
          style={{
            overflow: "hidden",
            willChange: "transform",
            height: totalHeight,
            position: "relative",
            minHeight: height
          }}
        >
          <div
            className={class_maker({prefix,name,main:"inner_content",iUN})}
            style={{
              willChange: "transform",
              transform: `translateY(${offsetY}px)`
            }}
          >
            { (has_more && show_loader && dir == "reverse") ? loader_display: null }
            {visibleChildren}
            { (has_more && show_loader && dir == "forward") ? loader_display: null }
          </div>
        </div>
      </div>
      </>
    );
  });
  // };

export default VirtualScroll;

const find_visible = ({viewport_height, dynamic_node, dynamic_height}) => {
  let iterator = 0;
  let node_height = 0;
  let ndx = 1;
  let static_value = dynamic_height[dynamic_node];// the height at the position we are at

  // what if were at the end of the dynamic_height array?
  while (node_height < viewport_height && dynamic_node + ndx < dynamic_height.length && iterator <= 50) {
    // this takes the top visible node and starts adding indexes and adding the height of that index until the 
    // viewport is height is reached
    node_height = dynamic_height[dynamic_node + ndx] - static_value;
    if(display_console || false) console.debug(`[VirtualScroll] find_visible \n viewport_height = ${viewport_height} \nnode_height = ${node_height}`);
    ndx++;
    iterator++;
  }// while

  if(iterator > 50){console.error(`[VirtualScroll] find_visible iterator saves an infinite loop`);}

  let visible_nodes = ndx - 1;
  if(display_console || false) console.debug(`[VirtualScroll] find_visible start = ${dynamic_node} visible nodes = ${visible_nodes}`);
  return visible_nodes;
}// find_visible

const getScrollBottom = (el, omit_viewport = false) => {
  let sT = el.scrollTop;
  let sH = el.scrollHeight;
  let vph = omit_viewport ? 0 : el.getBoundingClientRect().height;

  let sB = sH - (sT + vph);

  return sB.toFixed();
}// getScrollBottom


  /*
  // [article build your own virtual scroller](https://dev.to/adamklein/build-your-own-virtual-scroll-part-i-11ib)
  // [code sandbox](https://codesandbox.io/s/214p1911yn?from-embed=&file=/src/VirtualScroll.js)
  // wrap the item template in a memo fn, i want to do some things before i add the data to the elements
  const Item = React.memo(({ index }) => (
    <div
      style={{
        height: 30,
        lineHeight: "30px",
        display: "flex",
        justifyContent: "space-between",
        padding: "0 10px"
      }}
      className="row"
      key={index}
    >
      <img
        alt={index}
        src={`http://lorempixel.com/30/30/animals/${(index % 10) + 1}`}
      />
      row index {index}
    </div>
  ));

  const App = () => {
    return (
      <div className="App">
        <h1>Virtual Scroll</h1>
        <VirtualScroll
          itemCount={100}
          height={300}
          childHeight={30}
          Item={Item}
        />
        <hr />
        <h1>Hooks are awesome!</h1>
        <a
          rel="noopener noreferrer"
          target="_blank"
          href="https://github.com/500tech/hook-cook-book"
        >
          Explore more examples
        </a>
      </div>
    );
  }

  ReactDOM.render(
  <App />,
  document.querySelector('.root')
  );

  //sample component setup
  <VirtualScroll
    itemCount={100}
    height={300}
    childHeight={30}
    Item={Item}
  />
*/
