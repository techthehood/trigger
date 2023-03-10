import {useEffect, useRef, useState} from 'react';
import { YouTube } from 'mdx-embed';
import ProfileIcon from '../ProfileIcon';
import Modal from '../Modal';
import ErrorBoundary from '../Error';
// import { TriggerContext } from '../../triggerContext';
import Loader from '../Loader';
import { fido } from '../../tools/http';
import { exists, obj_exists } from '../../tools/exists';
import { useForm } from 'react-hook-form';
import PTreeForm from './lib/PTreeForm';
import SimpleTree from './lib/SimpleTree';

const display_console = false;

const { wrapr } = require('../../tools/wrapr');

require('./ProfileTree.scss');

const ProfileTree = (props) => {
  const {
    id,
    image,
    default_image,
    username,
    data = {ids:[],data:{}},
    // store,
    header = true,
    edit = false,
  } = props;

  const default_tree = {ids:[],data:{}};
  
  let profile_data = { name: "pTree", deep_dive: true, no_class: false };
  const [linkTree, setLinkTree] = useState({...data});
  const [loading, setLoading] = useState(typeof props.data != "undefined" ? false : true);// if data is external don't show loading


  const form_ref = useRef({});
  // const [title_error, setTitleError] = useState({ error: false, message: "" });
  
  // const TriggerStore = store;
  
  const { register, getValues, setValue, handleSubmit, watch, errors, formState, setError, clearErrors, triggerValidation } = useForm({ mode: "onchange", criteriaMode: "all" });
  const form_data = { register, getValues, handleSubmit, setValue, errors, formState, setError, clearErrors, triggerValidation };

  const doIt = async (e, obj, dta) => {
    // close the modal
    let values = form_data.getValues();

    let mod_values = { ...values };// modified_values
    delete mod_values.meta_data;

    let mode = dta.mode || "add";
    // check for blanks and if black do nothing
    // let is_valid = form_data.formState.isValid;// isValid doesn't help at all

    if(!obj_exists(values,"title")){
      // setError("title","value is required");
      form_ref.current.setTitleError({error: true, message:"value is required"});
      return;
    }else{
      form_ref.current.setTitleError({ error: false, message:""});
    }// else
    // return;// do nothing

    // debugger;
    // add these values to 2 places.  create an item with a unique id and associate with the local data
    // upload updates

    switch (mode) {
      case "edit":
        setLinkTree((prev) => {
          let update_obj = {...prev};
          update_obj.data[`${mod_values.id}`] = { ...mod_values };
          return { ...update_obj };
        });
        break;
    
      default:
        // add
        setLinkTree((prev) => {
          let prev_ids = prev.ids;
          let prev_data = prev.data;

          let update_obj = { ids: [...prev_ids, mod_values.id], data: { ...prev_data }};
          update_obj.data[`${mod_values.id}`] = {...mod_values};
          return { ...update_obj};
        });
        break;
    }

    try {
      let req_data = {entry: {...mod_values}};
      req_data.sponsor_id = id;

      let results = await fido({ path: "api/trigger/users", task: "setLinkData", data: req_data, cancel_obj:{} });

      // debugger;
      // setLinkTree(results.link_data);
      // setLoading(false);
    } catch (error) {
      console.error(`[ProfileTree] an error occured`, error);
    }

    e.preventDefault();
    obj.close();
  }// doIt

  const unDoIt = async (eId) => {
    // let req_data = { entry: { ...mod_values } };
    try {
      const link_id = eId;

      setLinkTree((prev) => {
        let prev_ids = prev.ids;
        let prev_data = {...prev.data};

        let updated_ids = prev_ids.filter((entry) => {
          return entry != link_id;
        })

        delete prev_data[`${link_id}`];

        let update_obj = { ids: [...updated_ids], data: { ...prev_data } };

        return { ...update_obj };
      });

      let req_data = { sponsor_id: id, link_id};

      let results = await fido({ path: "api/trigger/users", task: "deleteLink", data: req_data, cancel_obj: {} });
      // debugger;
      // setLinkTree(results.link_data);
      // setLoading(false);
    } catch (error) {
      console.error(`[ProfileTree] unDoIt an error occured`, error);
    }
  }// unDoIt

  const close_panel = (e, obj) => {
    // close the modal
    e.preventDefault();
    obj.close();
  }// close_panel

  const get_link_data = async ({cancel_obj}) => {
    // run a request to get link data
    try {
      let req_data = {};
      req_data.sponsor_id = id;
  
      let results = await fido({ path: "api/trigger/users", task: "getLinkData", data: req_data, cancel_obj });

      if(display_console || true) console.log(`[ProfileTree] results`, results);
  
      if(results.link_data){ 
        setLinkTree(results.link_data);
      }else{
        setLinkTree({...default_tree});
      }
      setLoading(false);
    } catch (error) {
      console.error(`[ProfileTree] an error occured`,error);
    }
  }// get_link_data

  // deprecated
  const update_link_data = async ({ cancel_obj = {} }) => {
    // update link data in real time
    let req_data = {...LinkTree};

    let results = await fido({ path: "api/trigger/users", task: "updateLinkData", data: req_data, cancel_obj });

    setLoading(false);
  }// update_link_data

  useEffect(() => {
    let cancel_obj = {};

    // if data isn't already given
    if(typeof props.data == "undefined") get_link_data({cancel_obj});

    return () => {
      if(display_console || false) console.warn(`[ProfileTree] canceling token`);
      if(cancel_obj.cancelToken) cancel_obj.cancelToken.cancel('[pTree] Operation canceled. unmounting.');
      // console.warn(`cancelToken for ${search_value}`,cancel_obj.cancelToken);
    }
  }, []);

  const display_form = (obj) => {

      // let hidden_cont = document.querySelector(".modal_home");
      // let stk_vw_cont = document.createElement('div');
      // stk_vw_cont.id = `stk_vw_cont${iUN}`;
      // stk_vw_cont.className = `stk_vw_cont${iUN} stk_vw_cont w3-part block`;
      // hidden_cont.appendChild(stk_vw_cont);


      let pTree_form_cont = wrapr({ name: "pTree_form_cont", home: ".modal_home", custom: "w3-part block" });

      const display_mode = typeof obj == "undefined" ? "add" : "edit";

      let modal_data = {
        name: "pTree_view",
        tag: "pTree_form",
        hasWrapper: true,
        // wrapper: {
        //   style:{
        //     zIndex: modal_z
        //   },
        // addClass: "some-class"
        // },
        modal: {
          addClass: "LookOut"
        },
        content: {
          addClass: "hide-scroll"
        },
        go:{
        	show: true,
        	callback: doIt,
          data: {mode: display_mode}
        },
        close: {
          show: true,
          //addClass:"pp_btn svg-icon-cross",
          // hide: modal_close_hide,// deprecated
          // hide: true,// it will probably never be hide
          callback: close_panel
        },
        cancel: {
          show: true,
          addClass:"d3-ico-full d3-disc-bg icon-cross",
          callback: close_panel
        }
      }// modal_data

    let f_data = { form_data, label: "some label", ref: form_ref }

    if(obj) f_data = {...f_data, ...obj};// add item data to form through props
    // modal_data.go.data.mode = "edit";// works

      let pTree_form_el = (
        <ErrorBoundary>
          <Modal data={modal_data} >
            <PTreeForm {...f_data} />
          </Modal>
        </ErrorBoundary>
      );

      ReactDOM.render(
        pTree_form_el,
        pTree_form_cont
      );
  }// display_form

  let link_els = linkTree.ids.map((entry, ndx) => {
    let link_data = {};
    link_data.item_data = linkTree.data[`${entry}`];
    link_data.item_data.id = entry;
    // needs edit and delete data
    if(edit){
      link_data.edit = edit;
      link_data.edit_callback = display_form;
      link_data.delete_callback = unDoIt;
    }

    let {title, description, tool, url, image, config} = link_data.item_data;

    return <SimpleTree {...link_data} key={`pTree_link${entry}_${ndx}`}/>;
  });

  // if (default_image) profile_data.default_image = default_image;
  // if (item.image) profile_data.image = item.image;
  // if (!exists(item.image) && !exists(default_image)) {
  //   // text_only_mode = true;// why am i setting this twice?
  //   profile_data.text_only_mode = true;
  // }// if

  let is_owner = true;


  return (
    <>
      <div className="pTree pTree_wrapper">
        { header ? <div className="pTree_profile">
          <ProfileIcon {...{ ...profile_data, image}} />
          <h1 className="pTree_username">{username}</h1>
          <hr/>
        </div> : null}
        { !loading ? (
            <ul className="pTree_link_wrapper">
              {link_els}
              
            </ul>
          ) : <Loader name={"pTree"} type={"dots"}/>
        }
        <YouTube youTubeId="mM5_T-F1Yn4" aspectRatio="4:3" />
      </div>
      {edit ? <div className="pTree_add icon-plus w3-btn w3-card"
        onClick={() => {
          display_form();
        }}
      >Add Link</div> : null}
    </>
  );
}

export default ProfileTree

/**

    "1633849314601":{
        "title" : "simple one liner",
        "tool" : "default",
        "url":"https://google.com"
    },
    "1633849314602":{
        "title" : "simple title desc",
        "description" : "no-url | here i want to test the clamp by adding a much longer description",
        "tool" : "default"
    },
 */