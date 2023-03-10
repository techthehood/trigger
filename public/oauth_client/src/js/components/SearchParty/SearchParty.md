# SearchParty notes

> im working to make the SearchParty component more stateless

#### initialization

```
  let search_data = storage_target ? {
    prefix,
    visible,// dont really need but i want to use this later for Filter component
    callback: find_it,
    reset: reset_list,
    search_display,
    list: storage_object.list || [],
    items: storage_object.data || {},
    render: "none"
  } : {};

  if(obj_exists(storage_object,"scroll_data"))  search_data.row_more = storage_object.scroll_data.row_more;

  return storage_target ? (<SearchParty {...search_data}/>) : null;
```

#### run an external request with a forceUpdate   

```
  const find_it = (obj) => {
    let {form_data, active_filters, search_value, cancel_obj, force_init = false} = obj;
    mc_search('e','',{state,prefix,form_data, modal, parentUpdate: forceUpdate, active_filters, search_value, cancel_obj, force_init});
  }// find_it
```
> this method runs its own request and processes the data before calling forceUpdate where SearchParty will 
> rerender and update the list display

#### reinternalize data to vScroll

_Feat.js_

```
  const find_it = (obj) => {
      console.warn(`[Feat] sp_ref`,sp_ref);


      if(obj_exists(sp_ref,"current.vIS_ref.current")){
        let view_comp = sp_ref.current.vIS_ref.current;
        let {search_value, active_filters} = obj;
        view_comp.payload_ref.current = {value: search_value, active_filters};

        // if(last_search_value){
        //   // this will always be the case from here - either the value has changed or the active filters
        // }
          view_comp.fetch_info({...obj, force_request: true, scroll_data: {}})
      }
    }// find_it
```
> this method tells vscroll to start over and track its own list data

#### search_display items (search display content)

```
  search_display = React.memo( ({index : ndx}) => {

    let item_id = storage_object.list[ndx];
    let item = storage_object.data[item_id];
    let list_length = storage_object.list.length;
    let ukey = iUN;

    if(item == undefined) return null;

    let bk_mb_name = `${prefix}_srch_bk_mb_${ndx}`;
    let mb_obj = {
      item,
      "prefix":prefix,
      ndx,
      // "home":bk_ul_id,
      "orient":orient,
      "mode":"search",
      actn_call: action_switch,
      "del_call":delete_bookmark,
      state
    };
    return <MakeBookmarks data={mb_obj} modal={modal} key={bk_mb_name} parentUpdate={forceUpdate} />;

  });// memo
}
```

#### **GOTCHA** - clash between persistent (useRef) form_data and updating form_data persistent doesn't clear isValid on unmounting   

> now the form_data doesn't reset when forceUpdate is called

```
  let form_data_ref = useRef({register, getValues, setValue, errors, isValid, triggerValidation, reset});
  let form_data = form_data_ref.current;// reset/refresh fails if form_data isn't persisted using useRef
  // let form_data = {register, getValues, setValue, errors, isValid, triggerValidation, reset};
```
> updating resets isValid with every rerender - i tapped into the control for Views auto render feature

#### is equipped to take external list data and external scroll_data
