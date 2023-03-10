  import { observer, inject } from "mobx-react";
  import /*React,*/ {useState, useEffect, useRef, forwardRef} from 'react';
  import IconWall from '../IconWall/IconWall';



  // const {icon_finder} = require('../../tools/icon_finder.js');
  const {exists} = require('../../tools/exists.js');
  const {wrapr} = require('../../tools/wrapr.js');
  const display_console = false;

  require('./filter.scss');

  /**
   * @category Core
   * @module Filter
   * @desc filter is used as the binder item search feature
   */
  const Filter = forwardRef((props, ref) => {

    let {
      name="d3_filter",
      iUN,
      default_active_filters,
      filter_value = "",
      ancestor = "",
      search_callback,
      export_active_filters,
      filter_scope = "local",
      view_type = "inline",/* alt "modal" (could be anything really)*/
      no_view = false,// trumps static view ( = static no_view) triggers always closed
      static_view = false,// triggers always open
      input_title = "",
      placeholder = `filter by title, date, tag...`,
      register,
      ref_data = {},
      input_name,
      icons_top = false,
      show_labels = true,
      mode,
      single_click,
    } = props;

    let iUN_ref = useRef(iUN || Math.round(Math.random() * 10000));
    iUN = iUN_ref.current;
    let filter_input = useRef();

    if(ref) ref.filter_input = filter_input;

    let init = useRef(false);

    const [val, setVal] = useState(0); // integer state
    const forceUpdate = () => {
      setVal(val => ++val); // update the state to force render
    }// forceUpdate

    const [exec_search, setExecSearch] = useState(0);

    const execute_search = () => {
      // this is used to execute a search using the filter type btns without clicking the go/search icon
      setExecSearch(exec_search => ++exec_search);
    }

    const [search_value = "", setSearchValue] = useState(filter_value);//* as props
    const [view_options, setView] = useState(no_view || !static_view ? false : true);// boolean
    // const setActiveFilters;

    const [active_filters, setActiveFilters] = useState(props.active_filters || []);
    const [typeObj, setTypeObj] = useState({});

    const last_filters = useRef(active_filters);// tracks changes in the filters locally - used to execute search

    useEffect(() => {
      // console.warn("[filter] value",search_value);

      if(init.current != true) return

      let cancel_obj = {};

        if(search_callback) search_callback({search_value, cancel_obj, force_init: true, type: typeObj});// process_search

        return () => {
          if(display_console || false) console.warn(`[Filter] canceling token`);
          if(cancel_obj.cancelToken) cancel_obj.cancelToken.cancel('Operation canceled due to new request.');
          // console.warn(`cancelToken for ${search_value}`,cancel_obj.cancelToken);
        }
    },[search_value, exec_search]);

    useEffect(() => {
      //
      if(search_value != ""){
        // remind the user that the filter is active
        filter_input.current.select();
      }
      return () => {
        if(display_console || false) console.warn(`[Filter] unmounting`);
      }
    },[]);

    const icon_finder = (val) => {
      return val;
    }// icon_finder

    // deprecated?
    const update_filters = (name) => {
      // what happens once you click the iconwall icons?
      let item_data = name;
      let temp_filters = [];

      if (active_filters.includes(item_data)) {
        temp_filters = active_filters.filter((item) => {
          return item != item_data;
        });
      } else {
        temp_filters = [...active_filters];
        temp_filters.push(item_data);
      }// else

      setActiveFilters(temp_filters);

      if(export_active_filters) {
        export_active_filters({value: temp_filters, ancestor})
        .then(() => {
          if(filter_scope == "local"){
            forceUpdate();
          }//if
        });
      }
    }// update_filters

    const updateValue = (val) => {
      setSearchValue(val);
    }// update_value

    const updateView = (bool) => {
      if(static_view || no_view) return;
      setView(bool);
    }

    const option_modal = () => {
      let filter_wall_cont = wrapr({name:"filter_wall_cont", home: ".modal_home", custom:"w3-part block data_type"});

      let data_obj = {
        label: {
          text: "filter types",
          description: "click the icons to display only certain data types"
        },
        callback: filter_options,
        default_options: default_active_filters,
        active_options: active_filters,
        show_labels,
        mode,
        single_click
      };

      ReactDOM.render(
        <IconWall {...{modal:true, ...data_obj, single_click:false}} />,
        filter_wall_cont
      );
    }// option_modal

    const filter_options = (e, obj) => {

      console.warn("[Arc] iconwall obj", obj);
      let temp_filters = single_click ? [obj.value] : [...obj.active_options];

      setActiveFilters(temp_filters);
      if(obj.type) setTypeObj(obj.type);
      if(export_active_filters) export_active_filters({value: temp_filters, ancestor});

      // setView(true);// don't change the view - leave the options visible

      // also execute search on btn update
      if(temp_filters.join(",") != last_filters.current.join(",")){
        //if filters have changed execute the search
        last_filters.current = [...temp_filters];
        init.current = true;
        execute_search();// this should execute a new search using the filter preferences
      }//if

      // obj.close();// using multi_update - don't use close

    }// filter_options

    let option_status_class = ( Array.isArray(active_filters) &&  active_filters.length != 0 ) ? `${icon_finder(active_filters[0])} heartbeat` : "options";
    // let option_status_class = (default_active_filters.join(",") != active_filters.join(",")) ? "question heartbeat" : "options";
    let filter_scope_icon = (filter_scope == "global") ? "compass2" : "location";

    let data_obj = {
      name:"filter_iWall",
      callback: filter_options,
      default_options: default_active_filters,
      active_options: active_filters,
      show_labels,
      mode,
      single_click,
    };

    let ancestor_str = (exists(ancestor)) ? `_${ancestor}` : "";

    let alt_input = (register) ? {
      ref:(e) => {
        try {
          filter_input.current = e;
          // register(e, ref_data);
          // register(input_name, ref_data);
        } catch (error) {
          console.log(`[Filter] an error occured`,error);
        }
      },
      name: input_name,
      title: input_title
    } : {
      ref: filter_input,
      title: input_title
    }

    
    let ctrl_icons = view_type == "inline" && view_options ? (
      <div className={`${name}${ancestor_str}_filter_option_wrapr_${iUN} filter_option_wrapr`}>
        <IconWall {...{modal:true, mode:"multi_update", inline:true, ...data_obj }} />
      </div>
    ) : null;

    let header_icons = icons_top ? ctrl_icons : null;

    let footer_icons = !icons_top ? ctrl_icons : null;

    return (
      <div id={`${name}${ancestor_str}_filter_wrapper_${iUN}`}
      className={`${name}${ancestor_str}_filter_wrappe_r${iUN} ${name}${ancestor_str}_filter_wrapper filter_wrapper  ${name}${ancestor_str} `}
      data-comp={`Filter`}
      >

        {/********************** view_options********************/}
        <>
          {header_icons}
          <div id={`${name}${ancestor_str}_filter_cont_${iUN}`}
          className={`${name}${ancestor_str}_filter_cont_${iUN} ${name}${ancestor_str}_filter_cont filter_cont  ${name}${ancestor_str} `}
          >
            <input id={`${name}${ancestor_str}_filter_input_${iUN}`}
            type="text"
            {...alt_input}
            {...register(input_name, ref_data)}
            className={`${name}${ancestor_str}_filter_input_${iUN} ${name}${ancestor_str}_filter_input filter_input  ${name}${ancestor_str} `}
            placeholder={placeholder}
            defaultValue={search_value}
            onFocus={(e) => {
              e.preventDefault();
              filter_input.current.select();
              updateView(true);
            }}
            onClick={(e) => {
              e.preventDefault();
              updateView(true);
            }}
            onChange={(e) => {
              e.preventDefault();
              init.current = true;
              updateValue(e.target.value);
            }} />
            <div className={[`${name}${ancestor_str}_filter_reset_${iUN}`,
              ` ${name}${ancestor_str}_filter_reset filter_reset filter_input_btns`,
              ` d3-ico icon-cross`].join("")}
              // value={`${search_value}`}
              onClick={(e) => { /*you need to do both*/
                e.preventDefault();
                init.current = true;
                updateValue("");
                updateView(false);
                filter_input.current.value = "";
               }}
            ></div>
            <div className={[`${name}${ancestor_str}_filter_options_${iUN}`,
              ` ${name}${ancestor_str}_filter_options filter_options filter_input_btns`,
              ` d3-ico icon-${option_status_class}`].join("")}
              onClick={(e) => {
                e.preventDefault();
                init.current = true;

                if(view_type == "inline"){
                  updateView(!view_options);
                }else{
                  option_modal();
                }
              }}
            ></div>
          </div>
          {footer_icons}
        </>
        {/********************** view_options********************/}

      </div>
    );
  })

export default Filter;

// searchBkmk]query = {
//   '$text': { '$search': 'art' },
//   project_id: { '$in': '5da54e08c72fdb4a0c765b0f' },
//   data_type: { '$in': ['folder'] }
