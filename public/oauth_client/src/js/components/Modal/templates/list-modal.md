

the list modal is a component whose content is added as a childnode to the modal component and where callbacks are given to the modal's close and go actions.
the modal is mostly self contained.  all of its other processes are carried out in method within the component itself (not in the modal)

```
  import {observer} from 'mobx-react';
  import {useContext, useRef} from 'react';

  import {MainContext} from '../mainContext';
  import Modal from '../../elements/Modal/Modal';

  const SelectOptions = observer((props) => {

    let state = useContext(MainContext);

    let init = useRef(false);
    let iUN_ref = useRef(Math.round(Math.random() * 10000));
    let iUN = iUN_ref.current;

    if(init.current == false){
      state.prep_temp_sections();
      init.current = true;
    }

    /*
    // deprecated
    const select_icons = {
          profile:"user",history:"star-full",bookmarks:"bookmark",
          library:"books",favorites:"bookmark2",recent:"clock",
          hold:"hold",search:"search"
        };
    */
      // state.section_choices is the source of the section choices.  the select_icons is just a record of what icons go with what section name

      // let all_types = state.temp_show_sections.map((sect,ndx) => {
      //   if(sect.home == true){
      //     section_home = sect.type;
      //   }
      //   return sect.type;
      // });

    /* // sample object array for the data
    [
      {  
        home: false
        icon: "user"
        name: "profile"
        type: "profile"
      }
    ]
    */

      let select_options = state.section_choices.map((sect, ndx) => {
        let test_data = state.test_section(state.temp_show_sections,sect, true);
        let is_it_there = test_data.present;
        // let is_it_there = all_types.includes(sect.type);

        let icon = (is_it_there) ? "checkmark" : "cross";
        let isActive = (is_it_there) ? "" : "inactive";

        // IMPORTANT: im not completely confident in this home trigger. it relys on unique type/name combinations
        let odt_icon = (typeof test_data.item != "undefined" && test_data.item.home) ? "home" : sect.icon;// select_icons[`${sect.type}`]

        return (
          <div
            className={`section_option_btn ${isActive}`}
            title={`click to toggle make this section visible or invisible to visitors`}
            key={`${sect.name}-${ndx}`}
            data-value={sect.name}
            onClick={(e) => {
              state.toggle_section(sect);
            }}
          >
            <div className={`select_option_data_type info_dot d3-disc d3-disc-bg d3-bg d3-ico icon-${odt_icon}`}
              title={`Click the icon to set first visible section visitors will see (section home).`}
              onClick={(e) => {
                state.set_home(sect);
                e.stopPropagation();
              }}
            ></div>
            <p>{sect.name}</p>
            <div className={`select_option_icon icon-${icon}`}></div>
          </div>
        )
      });

      const update_section = (e,obj) => {

        // do something

        obj.close();
      }//

    	const close_section_selector = (e,obj) => {

    			// closing chk does a regular close
    			obj.close();

    		//document.querySelector(".arc_popup_modal").classList.remove("block");// arc_popup
    	}//close_section_selector

      let modal_data = {
        name: "select_sections",
        tag: "core",
        hasWrapper: true,
        content:{
          addClass:"hide-scroll"
        },
        go:{
          show: true,
          callback: update_section,
        },
        close:{
          show: true,
          callback: close_section_selector
        },
        cancel:{
          show: true,
          callback: close_section_selector
        }
      }// modal_data

      return (
        <Modal data={modal_data} >
          <div className="section_option_title">Visitor Visibility</div>
          <div className="section_option_inner">
            {select_options}
          </div>
        </Modal>
      )
    });

    export default SelectOptions;

```
