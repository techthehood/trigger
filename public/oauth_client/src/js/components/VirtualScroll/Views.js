import /*React,*/ { Component, useCallback, createRef, memo } from 'react';
// import Item from './lib/Item/Item';// deprecated
// import Clips from '../Clips/Clips';
import VirtualScroll from '../VirtualScroll/VirtualScroll';
// import IconWall from '../IconWall/IconWall';
import Loader from '../Loader/Loader';

const {exists, obj_exists} = require('../../tools/exists');
// const {wrapr} = require('../../tools/wrapr');
const {observerSetupCallback} = require('../VirtualScroll/observer');
// import {PaperProvider, PaperContext } from '../triggerContext';
const display_console = false;

require('./Views.scss');
/**
 * a dumb portable Views component that works directly with vScroll - it doesn't know the content template
 * modified from Arc
 * @category Paper
 * @subcategory views
 * @module Views
 * @desc views main class based component
 * @requires VirtualScroll
 * @see {@link module:MainCore}
 */

/**
 * @file
 */

/**
 * [Views description]
 * @extends Component
 */
class Views extends Component {

/*
.dP"Y8 888888    db    888888 888888
`Ybo."   88     dPYb     88   88__
o.`Y8b   88    dP__Yb    88   88""
8bodP'   88   dP""""Yb   88   888888

[4MAX](http://patorjk.com/software/taag/#p=display&f=4Max&t=state)
*/
// this will get all data eventually unless i put a total (failsafe)
// once i create forever scrolling the failsafe wont be needed
// let [list, setList] = useState([]);
// let [loading, setLoading] = useState(true);
// let return_data_length = useRef(0);
// let init = useRef(false);
// let [info_page, setPage] = useState(1);
  constructor(props){
    super(props);
    this.state = {
      list: props.data.list || [],
      items: props.data.items || {},// this is not really used in Views - i may omit it
      setList: props.data.setList,
      reset_list: props.data.reset_list,
      list_src: props.data.list_src || props.data.setList ? "external" : "internal",
      request_src: props.data.request_src,
      /* !internal_tracking important to stop rerenders when using external scroll_data */
      internal_tracking: props.data.internal_tracking  != undefined ? props.data.internal_tracking : true,
      loading: true,
      childHeight: props.data.childHeight || 100,//255,
      renderAhead: 3,
      return_data_length: 0,
      init: false,
      info_page: 1,
      name: (exists(props.data.name)) ? props.data.name : (exists(props.data.mode)) ? props.data.mode : "default",
      title: (props.data.title )? props.data.title : "",
      icon: props.data.icon ? props.data.icon : "none",
      iUN: props.data.iUN || Math.round(Math.random() * 10000),
      limit: (props.upload && props.upload.limit) ? props.upload.limit : 20,// this is stupid???
      pair_page: 1,
      failsafe: 50,
      has_more: true,
      testing: false,
      flip: props.data.flip || false,
      dir: props.data.flip ? "reverse" : "forward",
      stats: props.data.stats || false,
      dynamic_height: props.data.dynamic_height || [0],// array of height calculations
      height_calc: props.data.height_calc || false,// dynamic_height callback
      has_dynamic_height : (typeof props.data.height_calc != "undefined") ? true : false,
      render: props.data.render || "auto",// "auto" causes the fetch_info or callback fn to run once during componentDidMount
      render_double: props.data.render_double || false,// reder_double causes a 2nd auto run to get another layer of list data
      scroll_data: null,
      reset: false,
      active_filters: "",
      main_loader: props.data.main_loader != undefined ? props.data.main_loader : true,
      scroll_loader: props.data.scroll_loader != undefined ? props.data.scroll_loader : true,
      processHeight: props.data.processHeight,
      track_position: props.track_position || false,
      visible: props.visible != undefined ? props.visible : true,
      shortfall: props.data.shortfall || 0
    }
    // why did i add visible? i needed it for Segue's switch between views
    // - if i set visible using the state its semi hard coded and doesn't change with prop changes. i have to call setState to change it
    // when i call it in render use  - props.visible != undefined ? props.visible : true

    // visible prop lets me hide Views and maintain its state internally - can't be done externally
    // if(props != undefined && typeof props.visible == "undefined") throw "[Views.js] prop.visible is required";

    // i can use this as a reset for thhe views list display
    // - removes the list ids array and the list items object,
    // - resets the page info for the request
    this.default_state = {
      return_data_length:0,
      info_page: 1,
      // pair_page: 1,
      has_more: true,
      scroll_data: null
    }

    // do i need this?
    if(this.state.list_src == "internal"){
      // !props.data.list_src
      // internal list_src
      this.default_state.list = [];
      this.default_state.items = {};
    }/*else{
      this.default_state.list = props.data.list;
    }*/
    // no else needed - if external list reset using setList

    this.observer = createRef();
    this.last_restock = createRef();
    this.next_restock = createRef();
    this.last_rootMargin = createRef();
    this.last_cancel = createRef();
    this.last_cancel.current = {};
    this.double_init = createRef();
    this.double_init.current = false;
    this.init = createRef();
    this.init.current = false;
    this.default_height = 470;
    this.height = createRef();
    this.height.current = this.default_height;
    this.auto_height = createRef();
    this.auto_height.current = false;
    this.payload_ref = createRef();
    this.payload_ref.current = {};
    // this.render_nbr = createRef();
    // this.render_nbr.current = 0;

    this.vscroll_ref = createRef();
    this.vscroll_ref.current = {};

    this.force_scroll = createRef();
    this.force_scroll.current = false;

    this.save_scroll_pos = createRef();
    this.save_scroll_pos.current = 0;

    this.position = createRef();
    this.position.current = props.data.position || 0;
    

    this.loading = createRef();
    this.loading.current = true;
    // this.has_more = createRef();
    // this.root_viewport = createRef();
    this.cancel_obj = createRef();// used in unmounting

    this.last_request_value = createRef();
    this.last_request_value.current = "";
  }// constructor

/*
88""Yb 88""Yb  dP"Yb  88""Yb 888888 88""Yb 888888 88 888888 .dP"Y8
88__dP 88__dP dP   Yb 88__dP 88__   88__dP   88   88 88__   `Ybo."
88"""  88"Yb  Yb   dP 88"""  88""   88"Yb    88   88 88""   o.`Y8b
88     88  Yb  YbodP  88     888888 88  Yb   88   88 888888 8bodP'
*/



  // let name = props.mode || "default";
  // let iUN = Math.round(Math.random() * 10000);
  // let limit = 20;
  // let pair_page = 1;
  // let failsafe = 50;
  // let snapper = props.snapper;

/*
88  88  dP"Yb   dP"Yb  88  dP .dP"Y8
88  88 dP   Yb dP   Yb 88odP  `Ybo."
888888 Yb   dP Yb   dP 88"Yb  o.`Y8b
88  88  YbodP   YbodP  88  Yb 8bodP'
*/

  // useEffect(() => {
  //   // get lazy list data (increments of 20)
  //   if(init.current == false && props.snapper.current.state.current_section == 1){
  //     fetch_info();
  //   }
  //     // window.snapper = props.snapper;
  //     // if(display_console || false) console.log('[snapper] test', props.snapper);
  //     // fetch_pairs();
  // },[props.snap_section]);
  //
  // useEffect(() => {
  //   // get lazy list data (increments of 20)
  //   if(init.current == true && return_data_length.current == limit && list.length < failsafe){
  //     //set new variables and fetch again
  //     // info_page ++;
  //     fetch_info();
  //   }// end if
  //     // fetch_pairs();
  // },[info_page]);

  // componentDidMount = () => {
  //   let state = this.state;
  //   let props = props;
  //
  //   if(state.init == false /*&& props.snapper.current.state.current_section == 0*/){
  //     this.fetch_info();
  //   }
  // }

  componentDidMount = () => {

    // this.root_viewport.current = document.querySelector(`.views_view_content.${this.state.name}`);
    // this.root_viewport.current = `.views_scroll_viewport_${this.state.iUN}`;//latest
    // this.restock_ndx.current = 10;// i may not need this
    // if(display_console || false) console.warn('[Views] component updated');
    let cancel_obj = {};
    this.cancel_obj.current = cancel_obj;

    if(this.state.render != "auto") return;

    if(this.props.data.callback != undefined){
      this.props.data.callback({obj:cancel_obj});
    }else{
      this.fetch_info({obj:cancel_obj});
    }// else

    // if (display_console || false) console.debug('[Views] CDM render_nbr', this.render_nbr.current);

  }// componentDidMount

  componentWillUnmount = () => {
    if(this.cancel_obj.current.cancelToken){
      this.cancel_obj.current.cancelToken.cancel('Operation canceled due to new request.');
    }// if
  }// componentWillUnmount

  componentDidUpdate = () => {
    let state = this.state;

    if(state.init == true && state.has_more && state.render_double && this.double_init.current == false){
      //set new variables and fetch again
      // info_page ++;
      if(display_console || false) console.warn(`[Views] rendering double`);
      this.props.data.callback();
    }// end if

    if(this.init.current == false){
      this.init.current = true;
      this.forceUpdate();
    }

    if(state.reset){
      // i may need a reset_double
      // console.error(`[Views.js] state.reset was called...`);
      if(this.props.data && this.props.data.callback){
        this.props.data.callback();// i did this if the request was external
      }else{
        this.fetch_info();
      }
      // state.reset = false;
      this.setState({reset: false});
    }

    // let ul_el = document.querySelector(`.views_view_content_${this.state.iUN}`);
    let ul_el = document.querySelector(`.${this.props.data.home}`);
    // if(display_console || false) console.warn("[views] views_view_content",ul_el);

    if(this.height.current == 0 && ul_el){
      // resize fix hack
      // the default for this.height.current is 470 - after 2 renders it can become set to zero using the ul_el's getBoundingClientRect
      // if it gets set to zero it would normally be the end of the line. but we use this hack to create one more render at a
      // specific time.  so if it is zero (due to css display: none), come in here and create a resize observer
      // on resize and with _this.height.current still at zero as a precaution reset the auto_height variable to false to
      // allow the height to be set one more time - or repeat this process at the next resize - otherwise unobserve
      let _this = this;

      let resizer = new ResizeObserver((entries) => {

        // _this.force_scroll.current = false;
        if(_this.height.current == 0){
          this.auto_height.current = false;
          if(display_console || false) console.warn("[Views] updating height")
          _this.forceUpdate();
          resizer.unobserve(entries[0].target);
        }
        // loadItems(10);
        // if(display_console || false) console.log('Loaded new items');
      });
      // start observing
      resizer.observe(ul_el);
    }// if this.force_scroll

    // if (display_console || false) console.debug('[Views] CDU render_nbr', this.render_nbr.current);

    if(this.state.flip && this.force_scroll.current == true){
      let scroll_pos = Number(this.save_scroll_pos.current) + this.state.shortfall;
      this.vscroll_ref.current.force_scroll(scroll_pos);
      this.force_scroll.current = false;
    }// if

  }// componentDidUpdate

  // useEffect(() => {
  //   if(state.render != "auto") return;
  //   this.fetch_info();
  // },[])

/*
8b    d8 888888 888888 88  88  dP"Yb  8888b.  .dP"Y8
88b  d88 88__     88   88  88 dP   Yb  8I  Yb `Ybo."
88YbdP88 88""     88   888888 Yb   dP  8I  dY o.`Y8b
88 YY 88 888888   88   88  88  YbodP  8888Y"  8bodP'
*/
  _this = this;

  fetch_info = async (obj = {}) => {

    let views = this;
    let state = this.state;
    let force_request = obj.force_request || false;// helps external triggers renew without updating state.has_more;
    if(!force_request && state.has_more == false) return;

    // this.render_nbr.current = this.render_nbr.current + 1;
    // if (display_console || false) console.debug('[Views] new render_nbr', this.render_nbr.current);

    //save the current scrollBottom
    if (state.flip && obj_exists(views.vscroll_ref,"current.force_scroll")){
      // save scroll position after calculating scrollTop distance from the bottom
      views.save_scroll_pos.current = views.vscroll_ref.current.getScrollBottom(views.vscroll_ref.current.viewport.current,true);
    }// if

    try {
      // let data_id = data_obj._id;
      views;
      let uploadData = {};
      // const ctrl_Url = `${location.origin}/api/alight/views/${request_tasks[views.props.mode]}`;
      const ctrl_Url = `${location.origin}/${views.props.path}/${views.props.task}`;// api/alight/views
      // const ctrl_Url = `${location.origin}/api/details/items/getItemInfo`;// it doesn't have to be a public api
      // const ctrl_Url = `${location.origin}/api/alight/users/${urlMod}`;// used to get recent during user_prefs request var urlMod = "getUserPrefs";
      // const recent = require('./lib/getData/recent');// location of routers recent query

      // uploadData.item_data = data_obj;
      uploadData.mode = "page";
      uploadData.page = state.info_page;
      uploadData.project_id = views.props.project_id;
      uploadData.limit = state.limit;
      uploadData.payload = views.props.payload || {};// payload vs upload - payload will be a property of body ie. req.body.payload
      // uploadData.host_id = state.host_id;
      uploadData.active_filters = state.active_filters;

      if(exists(views.props.upload)) uploadData = { ...uploadData, ...views.props.upload};// upload is any custom data that needs to be added

      if(exists(state.scroll_data)) uploadData.scroll_data = {...state.scroll_data};

      // NOTE: looks deprecated - idk though
      if(exists(obj.scroll_data)) uploadData.scroll_data = {...obj.scroll_data};// overwrites state.scroll_data - should only be used when resetting

      if(typeof views.payload_ref.current == "object") uploadData = { ...uploadData, ...views.payload_ref.current};// anything else the is added dynamically

      // let is_list_internal = views.list_src == "internal";//!obj_exists(views,"state.setList");// could also use views.list_src == "internal"
      // does the request have a value?

      // this section ensures new search request values (for internal list_src) don't add to the last values list array and items
      let has_value = exists(uploadData.value);

      let same_value = true;
      if(has_value){
        same_value = views.last_request_value.current == uploadData.value;
        views.last_request_value.current = uploadData.value;
      }

      let meseeks = "what?";
      let cancel_obj = obj.cancel_obj ? obj.cancel_obj : obj.obj ? obj.obj : {};
      cancel_obj.cancelToken = axios.CancelToken.source();
      // {
      //   cancelToken: cancel_obj.cancelToken.token
      // }

      const response = await axios.post(ctrl_Url, uploadData, {cancelToken: cancel_obj.cancelToken.token});

      let response_data = response.data;

      // if(display_console || false) console.log("[Views] fetch_info response",response);

      let requested_items = (exists(response_data.data)) ? response_data.data : [];
      if(display_console || true) console.warn("[Views] fetch_info requested_items",requested_items);
      // let new_list = list.concat(requested_items);
      // setList(new_list);
      // return_data_length.current = requested_items.length;
      // this splits the response into an ids array and obj data
      const {result_ids, result_data} = await create_order({result: requested_items});// this handles empty data and can return empty data

      // GOTCHA - breaks if you turn setState into an async fn
      if(views.state.setList){

        // DOCS: for external list
        
        views.state.setList((prev) => {

          // if flip, reverse the list id array data
          let list = views.state.flip ? [...result_ids.reverse(), ...prev.list] : [...prev.list, ...result_ids];
          let data = {...prev.data, ...result_data};
          let change_data = {list, data};

          if(views.state.height_calc){
            // if im taking the list in like this (which is the entire list) then there isn't a choice to add to the height
            // reprocess from scratch
            let height = views.state.height_calc({list, data/*, height: prev.height*/});// returns a progressive height array
            change_data.height = height;
          }// if

          // if the request returns new list values, trigger a manual scroll in the VirtualScroll component
          if (state.flip && prev.list.length != 0) {
            // only do this if it previously had value
            views.force_scroll.current = true;
          }// if flip

          return change_data;
        });
      }// views.state.setList

        let me_seeks = "none";

      if (views.state.internal_tracking){

        views.setState((prevState, props) => {

            let change_obj = {}
            change_obj.return_data_length = requested_items.length;
            // let ready_list = prevState.list.concat(requested_items);

            // let ready_list = [...new Set(prevState.list.concat(requested_items))];// still getting duplicates - i need separate ids

            if(prevState.list_src == "internal"){

              let ready_list = same_value ? [...new Set([...prevState.list,...result_ids])] : [...result_ids];

              let ready_items = same_value ? {...prevState.items,...result_data} : {...result_data};

              change_obj.list = ready_list;
              change_obj.items = ready_items;

              // if the request returns new list values, trigger a manual scroll in the VirtualScroll component
              if (state.flip && prevState.list.length != 0) {
                // only do this if it previously had value
                views.force_scroll.current = true;
              }// if flip
            }// if
            // return {return_data_length: requested_items.length, list: ready_list}

            let has_more;

            if(state.testing == true){

              if(response_data.scroll_data){

                let row_more = response_data.scroll_data.row_more;
                let pair_more = response_data.scroll_data.pair_more;

                has_more = ((row_more || pair_more)) ? true : false;
              }else{
                has_more = (requested_items.length > prevState.limit -1) ? true : false;// accounts for 20 and 21 - idk how im getting 21
              }

              // this is to manually advance the page - during forever scrolling i won't need this
              if(has_more && ready_list.length < prevState.failsafe){
                // this process is for testing, this way won't give be a page past the failsafe # so it will continue
                // loading the same data over and over.
                change_obj.info_page = prevState.info_page + 1;
                change_obj.has_more = true;
              }else{
                change_obj.has_more = false;
              }//else


            }else {

              if(response_data.scroll_data){

                let row_more = response_data.scroll_data.row_more;
                let pair_more = response_data.scroll_data.pair_more;

                has_more = ((row_more || pair_more)) ? true : false;
              }else{
                has_more = (requested_items.length > prevState.limit -1) ? true : false;// accounts for 20 and 21 - idk how im getting 21
              }

              if(has_more){
                change_obj.has_more = true;
                change_obj.info_page = prevState.info_page + 1;
              }else{
                change_obj.has_more = false;
              }// else

            }// else

            if(exists(response_data.scroll_data)){
              change_obj.scroll_data = response_data.scroll_data;
            }


            if(prevState.init == false) change_obj.init = true;
            change_obj.loading = false;
            // views.loading.current = false;

            return change_obj;
        });
      }// if internal_tracking


      // running setState triggers component did update even though this fn and its old values aren't updated
      // {running componentDidUpdate}

      // setList(prev_list => {
      //   // return prev_list.concat(requested_items)
      //   let ready_list = prev_list.concat(requested_items);
      //   // ready_list = switch_display({data: ready_list, sort_by: data_obj.filter},true);
      //   return ready_list;
      // });

      // if(display_console || false) console.log('[list] length',state.list.length);

      // this goes back in time still using the pre componentDidUpdate values
      // if(requested_items.length == state.limit && state.list.length < state.failsafe){
      //   //set new variables and fetch again
      //   // info_page ++;
      //   // setPage(info_page + 1);// info_page++ // incrementing with ++ changes the state directly but doesn't trigger a rerender - use + 1
      //   views.setState((prevState, props) => {
      //     return { info_page: prevState.info_page + 1}
      //   });
      //   // fetch_info();
      // }// end if

      // init.current = true;
      // views.setState({init: true});

    } catch (e) {
      if(typeof e == "undefined" || e.message.includes("cancel")) return;
      if(display_console || true) console.error(`[Views] request error`,e)
    }// catch


  }// fetch_info


  add_to_height = (height_value) => {

    this.setState((prevState) => {
      let change_obj = {};
      change_obj.dynamic_height = Math.ceil(prevState.dynamic_height + height_value);
      return change_obj;
    })
  }

  restock = async () => {
    let _this = this;

    this.setState({loading: true});
    if(_this.props.data.callback){
      // meant for external data fetcher
      _this.props.data.callback()
      .then(() => {
        // this.setState({loading: false});
        if(display_console || false) if(display_console || false) console.warn(`[restock] state set`,this.state);
      });
    }else {
      _this.fetch_info();
    }// else

  }//

  // used by pull to refresh? - fetch_info runs in componentDidUpdate
  refresh_callback = (e, obj) => {

    if(display_console || false) console.warn("[Views] iconwall obj", obj);
    if(display_console || false) console.warn("[Views] iconwall _this", _this);

    let state_update = {...this.default_state};

    // how do i refresh the list externally? - send a refresh callback with the state and setter
    if(this.state.list_src != "internal"){
      // call the refresh callback
      this.state.reset_list();
    }

    if(this.state.internal_tracking){
      // if obj exists this is being called from a modal - otherwise don't bother changing things
      if(exists(obj)) state_update.active_filters = obj.active_options;
      state_update.reset = true;

      this.observer.current = null;// restarting the observer works in correctly restarting virtual scrolling
      this.setState((prevState) => {
        return {...prevState,...state_update}
      });
      // this.fetch_info();// how do i start from scratch? (fetch_info runs in componentDidUpdate)
    };

    if(exists(obj)) obj.close();
  }// refresh_callback

  save_position = (position) => {
    // let s = this.state;
    // let store = s.app_state;
    //
    // store.save_position({ancestor: s.binder, position})
    this.position.current = position;
  }// save_position



/*
88""Yb 888888 88b 88 8888b.  888888 88""Yb
88__dP 88__   88Yb88  8I  Yb 88__   88__dP
88"Yb  88""   88 Y88  8I  dY 88""   88"Yb
88  Yb 888888 88  Y8 8888Y"  888888 88  Yb
*/

  // let list_data = list.length > 0 ?
  // list.map((item, ndx) => {
  //   return (
  //     // <li key={`${data_obj._id}_${item._id}`} >{item.title_data}</li>
  //     <Item key={`${name}_view_${item._id}_${ndx}`} data={item} />
  //   );
  // }) : null;

  observerCallback = (node) => {
    // let fetch_me = this.fetch_info;

    let has_more = (exists(this.has_more) && exists(this.has_more.current)) ? this.has_more.current : this.state.has_more ;

    const my_observer = observerSetupCallback.bind(this);
    my_observer({
      node,
      observer: this.observer,
      has_more,
      childHeight: this.state.childHeight,
      renderAhead: this.state.renderAhead,
      last_rootMargin: this.last_rootMargin,
      restock: this.restock,
      next_restock:this.next_restock,
      last_restock:this.last_restock
    });

  }//observerSetupCallback

  render(){

    let state = this.state;
    let props = this.props;
    // let list_length = props.list.length;
    let renderAhead = state.renderAhead;
    let loading = state.loading;
    // ISSUE: when is request_src ever external? it never is.
    let request_src = state.request_src ? state.request_src : state.internal_tracking ? "internal" : state.list_src;// state.internal_tracking
    let has_more = (request_src == "external") ? props.data.has_more : state.has_more;
    let iUN = state.iUN;
    let visible = props.visible != undefined ? props.visible : true;

    // if (display_console || false) console.debug('[Views] RNDR render_nbr', this.render_nbr.current);

    if(/*typeof props != "undefined" &&*/ visible){


      // if(this.root_viewport) this.root_viewport.current = `.views_view_content_${iUN}`;

      // if(state.list.length != 0){
      //
      //   // let Item = props.Item;
      //
      //   list_data = React.memo( ({index : ndx}) => {
      //     // <li key={`${data_obj._id}_${item._id}`} >{item.title_data}</li>
      //     let item_id = state.list[ndx];
      //     let item = state.items[item_id];
      //     let list_length = state.list.length;
      //     let ukey = state.iUN;
      //     // if(display_console || false) console.warn("[list_data] rerendering", ndx);
      //
      //     // if(display_console || false) console.warn("[item]",item);
      //     // if(state.list.length == ndx + 1){
      //     //   // if(display_console || false) console.warn("[Views] prepping elements");// log on the last element
      //     //   return (
      //     //     <div className="views_item_wrapper" key={`${item._id}_${ndx}`} ref={this.observerSetupCallback} data-ndx={ndx} >
      //     //       <Item key={`${state.name}_view_${item._id}_${ndx}`} data={item} />
      //     //     </div>
      //     //   );
      //     // }else {
      //     return (
      //       // (list_length == ndx + 1) ?
      //       // <div className="views_item_wrapper" key={ndx} data-ndx={ndx} ref={this.observerSetupCallback}  style={{border:"1px solid green"}}>
      //       //   <Item data={item} />
      //       // </div>
      //       //  :
      //       <div className="views_item_wrapper" key={ndx} data-ndx={ndx}>
      //         {/* <Item data={item} store={props.store}/> */}
      //           <Clips data={{...item, state: props.store}} mode="core" /*root={"modal_cont"}*/ />
      //       </div>
      //     );
      //     // }
      //
      //   });
      // }else{
      //   list_data = null;
      // }

      // if(display_console || false) console.warn("[Views] rendering",state);

      if((exists(this.init.current && this.auto_height.current != true))){
        // make sure this height is only set once - fix - height set to zero after closing & reopening main core
        // let ul_el = document.querySelector(`.views_view_content_${iUN}`);// doesn't exist yet
        let ul_el = document.querySelector(`.${props.data.home}`);// doesn't exist yet
        // let ul_el = document.querySelector(".fldr_display");
        // GOTCHA: home must have a css height (even height: 100%) for this to work properly
        this.height.current = (ul_el && ul_el.getBoundingClientRect().height) ? Math.floor(ul_el.getBoundingClientRect().height) : height;
        this.auto_height.current = true;
      }

      let height = (exists(this.height.current) && !isNaN(this.height.current)) ? this.height.current : this.default_height;// hack - helps ensure there will be a height
      // it also helped to take the views_view_content element out of the display_contents condition and add it to the mostly present display_els

      let title = (exists(state.title)) ? state.title : state.name;// name already conditions mode above
      let icon = state.icon;
      let view_list = props.data.list ? props.data.list : state.list;

      let vScroll_data = {
        name:"views_scroll",
        // prefix:"views",
        itemCount:view_list.length,
        height:height,
        childHeight:this.state.childHeight,
        has_dynamic_height:this.state.has_dynamic_height,
        // dynamic_height:this.state.dynamic_height, // failed
        dynamic_height:props.data.dynamic_height,
        Item:props.data.list_display,
        renderAhead:renderAhead,
        padding:40,
        hide_scroll:true,
        observer:this.observerCallback,
        loading:loading,
        has_more:has_more,
        iUN:iUN,
        show_loader: this.state.scroll_loader,
        dir: this.state.dir,
        stats: this.state.stats,
        refresh:{callback:this.refresh_callback, timer:1000, wait: false},
        // render_nbr:  this.render_nbr.current,
        data_ref: this.vscroll_ref.current
      }// vScroll_data

      if(this.props.data.flip && this.props.data.position){
        // this should be ok, it will only set once
        vScroll_data.position = this.props.data.position;
      }// if 

      if(this.state.track_position){
        vScroll_data.position = this.position.current
        vScroll_data.save_position = this.save_position;
      }// if

      // deprecated VirtualScroll prop structure
      // name={"views_scroll"}
      // // prefix={"views"}
      // itemCount={props.data.list.length}
      // height={height}
      // childHeight={this.state.childHeight}
      // has_dynamic_height={this.state.has_dynamic_height}
      // // dynamic_height={this.state.dynamic_height}// failed
      // dynamic_height={props.data.dynamic_height}
      // Item={props.data.list_display}
      // renderAhead={renderAhead}
      // padding={40}
      // hide_scroll={true}
      // observer={this.observerCallback}
      // loading={loading}
      // has_more={has_more}
      // position={this.position.current}
      // iUN={iUN}
      // show_loader={this.state.show_loader}
      // refresh={{callback:this.refresh_callback, timer:1000, wait: false}}

      let display_contents = (props.data.list_display != null) ? (
          <>
          {(exists(this.init.current)) ? <VirtualScroll {...vScroll_data} /> : null}
          </>
        ) : (this.state.main_loader) ?  (
          // <div className="views_loader_wrapper" >
          //   <div className="views_item_loader loader reset-top"
          //     onClick={() => {
          //       if(display_console || false) console.warn(`[Views] loader was clicked`);
          //       this.refresh_callback();
          //     }} >
          //     <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
          //   </div>
          // </div>
          <Loader name={"views"} type={"dots"} inner={{
            onClick:() => {
              if(display_console || false) console.warn(`[Views] loader was clicked`);
              this.refresh_callback();
            }, variants:"reset-top"
          }}>
            <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
          </Loader>
        ) : null;// previously null - add an empty message and refresh btn here

      // let display_els = (
      //   <div className={`views_view_wrapper ${state.name}`}>
      //     <div className="views_view_header clamp-0">
      //       <div className={`views_view_icon icon-${icon} d3-ico d3-bloc`}></div>
      //       <div className="views_view_title clamp-1">{unescape(title)}</div>
      //     </div>
      //     <div className={`views_view_cont ${state.name}`}>
      //       <div className={`views_view_content views_view_content_${iUN} ${state.name} plain hide-scroll`}>
      //         {display_contents}
      //       </div>
      //     </div>
      //   </div>);

      return (
        <>
        {display_contents}
        {(/*this.state.loading && this.state.has_more &&*/this.state.main_loader && !this.state.init  && !display_contents /*NOW:10 what if its empty? test for this*/) ? (
          // <div className="views_loader_wrapper" >
          //   <div className="views_item_loader loader reset-mid"
          //     onClick={() => {
          //       if(display_console || false) console.warn(`[Views] loader was clicked`);
          //       this.refresh_callback();
          //     }} >
          //     <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
          //   </div>
          // </div>
          <Loader name={"views"} type={"dots"} inner={{
            onClick:() => {
              if(display_console || false) console.warn(`[Views] loader was clicked`);
              this.refresh_callback();
            }, variants:"reset-mid"
          }}>
            <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
          </Loader>
          ) : null }
      </>
      );

    }else{
      return (this.state.main_loader && (/*props == undefined || props != undefined &&*/ visible)) ? (
        // <div className="views_loader_wrapper hide-scroll" >
        //   <div className="views_item_loader loader reset-low"
        //     onClick={() => {
        //       if(display_console || false) console.warn(`[Views] loader was clicked`);
        //       this.refresh_callback();
        //     }} >
        //     <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
        //   </div>
        // </div>
        <Loader name={"views"} variants={"hide-scroll"} type={"dots"} inner={{
          onClick:() => {
            if(display_console || false) console.warn(`[Views] loader was clicked`);
            this.refresh_callback();
          }, variants:"reset-low"
        }}>
          <div className="loader_refresh icon-spinner11 d3-ico d3-bloc"></div>
        </Loader>
      ) : null;
    }
  }// render
}// Views


export default Views;

// style={{height: "200px", background: "red", width: "100%"}}
let request_tasks = {
  recent: "getRecent",
  bookmarks: "getBookmarks"
}

const create_order = ({result}) => {

  let result_id_ary = [];
  let result_id_obj = {};

  if(Array.isArray(result) && result.length != 0){
    result.forEach((item) => {
      result_id_ary = [...result_id_ary, item._id];// this will help with ordering
      result_id_obj[item._id] = item;
    });
  }//if

  let result_ids = [...result_id_ary];
  let result_data = {...result_id_obj};
  return {result_ids, result_data};

}// create_order
