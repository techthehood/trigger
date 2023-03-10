# Filter component notes

> SearchParty depends on filter

where does Filter get its initial input value (using SearchParty)?

_SearchParty.js_

```
    let add_initial_text = async (txt) => {
      // let stored_session = await my_storage({request: "search"});
      //
      // if(exists(stored_session.bookmarks) && exists(stored_session.bookmarks.request)){
      //   form_data.setValue("search_text",stored_session.bookmarks.request);// i can set the value here
      //   form_data.triggerValidation();
      // }// if

      form_data.setValue(input_name, txt);// i can set the value here
      form_data.triggerValidation();

    }// add_initial_text
```

_SeearchMe.js_

```
    useEffect(() => {
      if(init.start == true && init.ready == false){
        // only on second render
        // console.warn("[SearchParty] setting init...");
        add_initial_text();
        setInit((prev) =>{ return {...prev, ready: true};});
      }
    },[init]);

    const add_initial_text = async () => {

      let stored_session = await my_storage({state, request: "search"});

      if(exists(stored_session.bookmarks) && exists(stored_session.bookmarks.request)){
        // form_data.setValue("search_text",stored_session.bookmarks.request);// i can set the value here
        // form_data.triggerValidation();
        searchParty_ref.current.add_initial_text(stored_session.bookmarks.request);
      }// if

    }// add_initial_text
```

_ListBookmarks.js_   

```
    // switch statement

    case "search":
      // if(sessionStorage.bookmarks == undefined || sessionStorage.bookmarks == "" || sessionStorage.bookmarks == '{"search":[]}') return null;
      storage_target["bookmarks"]
      // storage_object = JSON.parse(sessionStorage.bookmarks);
      storage_object = (typeof storage_target["bookmarks"] == "string") ? JSON.parse(storage_target["bookmarks"]) : {...storage_target["bookmarks"]};
      if(init == false){
        // use this once if it exists
        document.querySelector(`.${prefix}srchInp_TInput`).value = storage_object.request;
      }
      // set the value of the search btk
      // state.object_elements["arc_srchInp"].setCurrentValue(storage_object.request);// see error below
      // ISSUE: Uncaught (in promise) TypeError: Cannot read property 'setCurrentValue' of undefined
    break;
```
> why do i go all these places just to set the input value?