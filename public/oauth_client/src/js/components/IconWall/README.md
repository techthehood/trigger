


setup
```
  import IconWall from '../IconWall/IconWall';
  const {wrapr} = require('../../tools/wrapr');
```

#### iconwall multi_click usecase
```
    option_modal = () => {
      let icon_wall_cont = wrapr({name:"icon_wall_cont", home: ".modal_home", custom:"w3-part block data_type"});

      let default_options = ['link','folder','image','text','activity','video'];

      let data_obj = {
        label: {
          text: "display types",
          description: "click the icons to display only certain data types"
        },
        callback: this.iconWall_callback,
        default_options,
        active_options: this.state.active_options
      };

      ReactDOM.render(
        <IconWall modal={true} data={data_obj} single_click={false} />,
        icon_wall_cont
      );
    }// option_modal
```
> it uses its own modal so run it in a function that calls the modal and passes in a callback to process the click or go action


option icon the ran the option_modal fn
```
  <div className="arc_view_options icon-options d3-ico d3-bloc"
    onClick={(e) => {
      this.option_modal(e);
    }}
    ></div>
```
**IconWall outputs an array of the default filter values that were passed in**

sample callback
```
  iconWall_callback = (e, obj) => {
    console.warn("[Arc] iconwall obj", obj);
    let state_update = {...this.default_state};
    state_update.active_options = obj.active_options;// icon wall multiple items array
    state_update.reset = true;

    this.observer.current = null;// restarting the observer works in correctly restarting virtual scrolling
    this.setState({...state_update});
    // this.fetch_info();// how do i start from scratch?

    obj.close();
  }// iconWall_callback
```

#### adding to db find query
```
  let my_data = req.body.my_data;
  let active_options = my_data.active_options

  // turn the find data object into a separate object named 'query'
  let query = { user_id: req.user._id, ancestor: {$exists: true, $eq:item_ancestor}, type: item_type };

  // then conditionally add the search filters
  if(Array.isArray(active_options)){
    query[`data_type`] = { "$in": active_options };
  }


  rows = await Item.find(query)
```

#### single_click mode
**default false**

if single mode there won't be a go btn and clicking an icon will close the  modal (if has a modal)
and send back the value of the clicked btn based on icon_data;

#### adding a single_click iconwall

```
  import IconWall from '../../../elements/IconWall/IconWall';
  const {wrapr} = require('../../../tools/wrapr');

  const flavor_options_callback = (e, obj) => {
    // console.warn("[Arc] iconwall obj", obj);

    let action = obj.value;

    switch (action) {
      case "add":
        // process_attach(e);
        if(display_console || false) console.warn(`[Flavor] option ${action} was clicked`);
      break;
      case "edit":
        // process_attach(e,"portal");
        if(display_console || false) console.warn(`[Flavor] option ${action} was clicked`);
        // edit the active bookmark "favorites name"?
      break;
      case "delete":
        // process_move(e);
        if(display_console || false) console.warn(`[Flavor] option ${action} was clicked`);
        // delete the active bookmark "favorites name"?
      break;
    }

    obj.close();
  }// flavor_options_callback

  const flavor_options = () => {
    let flavor_option_cont = wrapr({name:"flavor_option_cont", home: ".modal_home", custom:"w3-part block data_type"});

    let default_options = ['edit','delete','add'];// the names of the different options
    let option_icons = ['pencil','bin','plus'];// the icons for the differnet options

    let data_obj = {
      label: {
        text: "favorites controls:",
        description: "add edit or delete options"
      },
      callback: flavor_options_callback,
      default_options,
      option_icons,
      active_options: ""
    };

    ReactDOM.render(
      <IconWall modal={true} data={data_obj} single_click={true} />,
      flavor_option_cont
    );
  }// flavor_options

  <div className={`${prefix}_flavor_options flavor_options flavor_ctrls icons d3-ico d3-ico-btn icon-options`}
    onClick={flavor_options}
  ></div>
```

#### iconwall inline multi_update
```
  let data_obj = {
    callback: filter_options,
    default_options: default_active_filters,
    active_options: active_filters
  };


  <IconWall modal={true} data={data_obj} mode="multi_update" inline={true}/>
```
