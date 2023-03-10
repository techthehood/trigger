# views notes

> Views can be used with internal or external list_src and internal_tracking true || false

using with list_src "external" (?) and internal_tracking

_Segue.js_

```
  let feed_vSData = has_feed ?  {
      ref: feed_ref,// ref needed to attach entire instance of the Views class for later reference execution of processes
      // store,// not needed
      payload,
      upload:{feed_ids:section.feed_ids},
      path,// * required for internal_tracking
      task: alt_task,// * required for internal_tracking
      // visible: (mode  == modes[1]) ? true : false,// dynamic with mode value - view.js true by default
      // track_position: true,
      project_id: pref_data.project_id,// not sure this is necessary LATER: make this optional
      host_id,// LATER: make optional
      // text_view,// not needed
      data: {
        childHeight: 255,
        home:`view_content_${iUN}`,
        iUN: iUN,
        main_loader: true,
        scroll_loader: true,
        // callback:fetch_info,
        list: feeds.list,
        items: feeds.data,
        setList: setFeeds,
        reset_list,
        list_display: feed_display,
        // flip: true
        // height_calc,
        // dynamic_height: feeds.height
      }
  } : {}// feed_vSData

  let feed_contents = has_feed ? <VIScroll {...feed_vSData}/> : null;
```

Segue use case to initiate Views (VIScroll)   

_MainCore.js_

```
  snap_content.push(
    <Segue mode="bookmarks"
      key={`arc_bookmarks_${iUN}`}
      // ref={element => {
      //   return user_sections.current[bkmk_id] = element;// bkmk_index
      // }}
      host_id={state.host_id}
      text_view={state.text_view}
      section={sect}// adds the entire sect (section) object
      ref={user_sections.current[bkmk_id]}/*funtional components just get an empty object*/
      render="delay"
      // path='api/alight/arc'
      task='getBookmarks'
      payload={sect.name}
      store={state}
      name={sect.name}
      icon={sect.icon}
    />
  );
```

> so to duplicated this to other components using Views (VIScroll)

> **Views uses [host_id], [render], path, task, payoad**
> path, task, payload (seem to be the most important for making a request)
> without path a default path will be supplied


> it can use ref if there is other dynamic data that needs to be added to the request - the updated data would be added to ref.payload_ref.current
> current is set to be an object, as long as you don't overwrite it, it can be added to with dot/bracket notation
> substitute ref for whatever the ref variable that was passed (feed_ref) is an example used above eg. feed_ref.payload_ref.current.whever_new_data_value
> profile_ref.current needs to be formatted with {item_prop: value} that corresponds with a property the server task is expecting

my current wrapper component to VIScroll

```
  let search_vSData = /*storage_target ?*/  {
    ref: vIS_ref,
    data: {
      // callback: find_it,
      childHeight: 43,
      home:`search_display_${iUN}`,
      iUN: iUN,
      main_loader: false,
      scroll_loader: true,
      // callback:fetch_info,
      render,
      // setList: setFeeds,
      reset_list,
      list_display: search_display,
      // list_src,
      // internal_tracking:false,
    }
  } /*: {}// search_vSData*/

  if(list){
    search_vSData.data.list = list;
    search_vSData.data.items = items;
  }

  if(path) search_vSData.path = path;
  if(task) search_vSData.task = task;
  if(payload) search_vSData.payload = payload;
```
