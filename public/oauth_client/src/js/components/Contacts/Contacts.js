import /*React,*/ {useState, useRef, useContext, useEffect} from 'react';
import { observer } from 'mobx-react';
import Filter from '../Filter/Filter';
import { obj_exists, exists } from '../../tools/exists';
import SearchParty from '../SearchParty';
import { search_contacts } from './search_contacts';
import { TriggerContext } from '../../triggerContext';
import LookOut from '../LookOut/LookOut';
import {contact_data, types} from './Contacts.data';

require('./Contacts.scss');

const Contacts = observer(({
  sponsor_id = "xyz",
}) => {
  
  const {FAVORITES, SPONSOR, CLIENT, CONSULTANT, FAITH, COMMUNITY} = types;
  const TriggerStore = useContext(TriggerContext);

  const sp_ref = useRef({});
  const search_ref = useRef({});

  // const [label, setLabel] = useState("search Contacts");// filter_values[1].label
  const [type, setType] = useState();
  const [typeObj, setTypeObj] = useState({label: "search Contacts"});
  const [val, setVal] = useState(0);
  const iUN_ref = useRef(Math.round(Math.random() * 10000));
  const iUN = iUN_ref.current;

  const forceUpdate = () => {
    setVal(val => ++val); // update the state to force render
  }// forceUpdate

  useEffect(() => {
    // find_it({});
  },[]);

  const find_it = async (obj) => {
    console.warn(`[Feat] sp_ref`, sp_ref);
    console.log(`[Contacts] find_it obj`, obj);
    

    // i really want this to be single click

    // if (obj_exists(sp_ref, "current.vIS_ref.current")) {
    //   let view_comp = sp_ref.current.vIS_ref.current;
    //   let { search_value, active_filters } = obj;
    //   view_comp.payload_ref.current = { value: search_value, active_filters };

    //   // if(last_search_value){
    //   //   // this will always be the case from here - either the value has changed or the active filters
    //   // }
    //   view_comp.fetch_info({ ...obj, force_request: true, scroll_data: {} })
    // }// if

    if(obj_exists(obj,"type.label")) setTypeObj(obj.type);

    // NOTE: hopefully a single type "string" doesn't become an issue here
    let targ_type = obj.active_filters[0];//obj_exists(obj, "type.text") ? obj.type.text : obj.type;
    setType(targ_type);

    let { form_data, active_filters, search_value, cancel_obj, force_init = false/*, forceUpdate*/ } = obj;
    await search_contacts('e', '', { state: TriggerStore, /*prefix,*/ form_data, /*modal,*/ parentUpdate: forceUpdate, active_filters, search_value, cancel_obj, force_init });

  }// find_it

  let search_display = null

  if (exists(type) && obj_exists(TriggerStore, `contacts.${type}.order`) && TriggerStore.contacts[type].order.length > 0){
    search_display = React.memo(({ index: ndx }) => {
      // on internal-internal this wrapper isn't forced to render so this value won't change when items are found in the child component
      try {
        let views_component = TriggerStore.contacts[type];
        let item_id = views_component.order[ndx];
        let item = views_component.data[item_id];
        let list_length = views_component.order.length;
        let ukey = iUN;
        let icon = type == "faith" ? "fire" : typeObj.icon;
    
        if (item == undefined) return null;
    
        let sfi_name = `srch_ft_item_${iUN}_${ndx}`;
    
        return <LookOut {...{ item, ndx, iUN, icon}} key={sfi_name} />;
      } catch (error) {
        return <div className="dummy_data">dummy data</div>
      }typeObj.icon
    });// search_display memo
  }else{
    search_display = null;
  }

  const reset_list = () => {

    return Promise.resolve();
  }// reset_list

  // let filter_values = ['user', 'cross', 'qrcode', 'video2-off'];
  let filter_values = [
    {...contact_data.favorites},
  ];
  
  if(TriggerStore.type == CLIENT){
    filter_values.push({ ...contact_data.sponsor });
  }else{
    // if admin see sponsors
    // filter_values.push({ text: 'sponsors', icon: 'key', label: 'show sponsors' });
    filter_values.push({ ...contact_data.client });
  }// else


  filter_values = [
    ...filter_values,
    { ...contact_data.consultant },
    { ...contact_data.faith },
    { ...contact_data.community },
  ];
  // { text: 'improvement', icon: 'bug', label: 'ideas and bugs' },
  
  /**
   * DOCS: filter values can be an array of objects
   * let filter_values = [{ text: 'sponsor', icon: 'user', label: 'show sponsor' }, { text: 'cross', icon: 'cross', label: 'close item' }];
   * NOTE: text fills in title and the return value - label is an iconwall label that shows under the icon 
   * (not for inline icons)
   */

  let filter_obj = { 
    static_view: true, 
    icons_top: true, 
    default_active_filters: filter_values,
    default_filters: filter_values
  }

  let has_type = exists(type);
  let has_order = !has_type ? false : obj_exists(TriggerStore, `contacts.${type}.order`);
  let has_data = !has_type ? false : obj_exists(TriggerStore, `contacts.${type}.data`);
  let has_scroll_data = !has_type ? false : obj_exists(TriggerStore, `contacts.${type}.scroll_data`);
  let list = !has_type || !has_order ? [] : TriggerStore.contacts[type].order;
  let items = !has_type || !has_data ? {} : TriggerStore.contacts[type].data;
  let row_more = !has_scroll_data ? false : TriggerStore.contacts[type].scroll_data.row_more;

  let search_obj = {
    ref: sp_ref.current,
    input_ref: search_ref.current,
    // input_name: "search_input",
    callback: find_it,
    reset_callback: reset_list,
    search_display,
    list_src: "external",
    task: `searchContacts`,//`getBookmarks`,
    path: `api/trigger/users`,
    project_id: sponsor_id,
    payload: "bookmarks",
    list,
    items,
    render: "none",
    default_filters: filter_values,
    active_filters: [],
    headless: true,
    static_view: true,
    icons_top: true,
    show_labels: false,
    single_click: true,
    row_more,
    // export_options: true,
    // export_home: `feat_search_content_${iUN}`,
  };

  return (
    <div className="contacts_wrapper">
      <div className="contacts_label">{typeObj.label}</div>
      <SearchParty  {...search_obj}/>
    </div>
  );
})// Contacts

export default Contacts