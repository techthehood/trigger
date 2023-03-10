
  import { useState, useRef, useMemo } from 'react';
  import MasterImage from '../../../../../../core/d3po_ITKR/src/app.d3po_ITKR';
  // import MasterImage from '@sunzao/d3po_itkr';
  // import MasterImage from '@sunzao/d3po_itkr/d3po_ITKR.js';

  // console.log("info_icon ready");

  const {htmlDecode} = require('../../tools/html_decode.js');
  const {has_extra_data} = require('../../tools/has_extra_data.js');
  const {get_default_image} = require('../../tools/get_default_image.js');
  const {exists} = require('../../tools/exists.js');
  const {detect_project_type} = require('../../tools/detect_project_type');

  require('./ProfileIcon.scss');


  /**
   * @module ProfileIcon
   * @desc self explanitory
   * @category display
   * @subcategory icons
   * @param {object} props
   * @example
   * // set deep dive to true to run default callback go_to_profile
   * let p_data = {
   *   // item:data,
   *   preset_data:data.preset_data,
   *   name: "clip_profile",
   *   // callback: callbackName
   *   deep_dive:true,
   *   // deep_dive: callbackName,
   *   // init_stage: 2,
   *   // fallback: "icon"
   * }
   * <ProfileIcon data={p_data}/>
   *
   * // you can also omit item and just pass in the preset_data
   *
   * // add a callback to deep_dive to use a different callback that the default
   * <ProfileIcon data={{ item:data, name: "clip_profile", deep_dive: callbackName}}/>
   *
   */

  /**
   * @file
   */

  const ProfileIcon = (props) => {


    //sample:
    // <AWrapr tVar={tVar} ></AWrapr>
    let [imgError,setImgError] = useState(false);
    let [textOnly, setTextOnly] = useState(false);
    let init = useRef(false);

    /**
    * @member data
    * @type {object}
    * @prop {object} props.data
    * @prop {object} [data.item] item data object
    * @prop {object} [item.preset_data] user/owner preset data
    * @prop {string} data.name element class name tags
    * @prop {function} [callback = callbackName] can take a callback fn
    * @prop {boolean} [deep_dive = false] also uses deep_dive = callbackName
    * @prop {number} [init_stage = 2] can force an inital stage for testing
    * @prop {string} [fallback = "icon"] can fallback to an site image or an icon element
    *
    */
    let data = exists(props.data) ? props.data : props;
    let item = data.item || {};
    let no_class = data.no_class || false;
    let preset_data = exists(item.preset_data) ? item.preset_data : data.preset_data;
    let name = data.name || "";
    let tag = data.tag || "";
    let fallback = data.fallback || "icon";// "icon" || "image"
    let text_only_mode = data.text_only_mode || false;

    let init_stage = data.init_stage || 1;
    let imageStage = useRef(init_stage);
    // set the image stage
    if(init.current == false){
      // determine the initial state
      if(preset_data && exists(preset_data.items) && exists(preset_data.items.image) &&
      exists(preset_data.items.image.value) && preset_data.items.image.value != "unavailable"){
        // were in stage 1, continue
      }else if(preset_data && exists(preset_data.defaults) && exists(preset_data.defaults.image) &&
      exists(preset_data.defaults.image.value) && preset_data.defaults.image.value != "unavailable"){
        imageStage.current = 2;
      }else{
        imageStage.current = 3;
      }
    }// init

    // if no callback is provided && deep_dive == true, runs go_to_profile
    let deep_dive = (exists(data.deep_dive)) ? data.deep_dive : false;

    let iUN_ref = useRef(Math.round(Math.random() * 10000));
    let iUN = data.iUN || iUN_ref.current;

    const [val, setVal] = useState(0); // integer state
    const forceUpdate = () => {
      setVal(val => ++val); // update the state to force render
    }// forceUpdate

    /**
     * @member img_error
     * @param  {object} obj not needed here
     * @desc sets the imageStage to a new tier (up to 3) with each error - start with desired image,
     * onerror fall back to default image, on error again fall back to site image or use icon
     * @return {void}     [description]
     */
    const img_error = (obj) => {
      let meseeks = "myerror";
      // if(imgError == false){
      //   setImgError(true);
      //   setTextOnly(true);
      //   // this.setState({text_only: true, img_error: true});
      // }//if
      if(imageStage.current == 1 && preset_data && exists(preset_data.defaults) && exists(preset_data.defaults.image &&
      exists(preset_data.defaults.image.value) && preset_data.defaults.image.value != "unavailable")){
        // make sure the defaults exist
        imageStage.current = 2;
      }else{
        imageStage.current = 3;
      }
      forceUpdate();
    }// img_error

    const get_path = () => {
      let path_array = location.pathname.split("/");
      // this shouldn't be empty - if it is ill need to do something
      return path_array[1];
    }

    const go_to_profile = () => {
      console.warn("[ProfileIcon] go_to_profile clicked!");
      preset_data;
      let project = preset_data.project;
      let viewer_id = VIEWER_DATA.project_id;
      // let preset_id = preset_data.user.user_id;
      // let preset_alias = preset_data.project.alias;
      let type = detect_project_type({...project});

      let preset_alias = (type == "project" && project.alias.includes(project.parent_project)) ?
      `${project.parent_name}/${project.path}` : project.alias;

      let path = get_path();

      // let is_preset_owner = (viewer_id == preset_id) ? true : false;// deprecated

      // deprecated?
      // let is_on_preset_page = location.href.includes(`/${path}/${preset_id}`) ? true : false;
      // let is_on_owner_page = (location.href.includes(`/${path}/${viewer_id}`) || location.pathname == `/${path}/`) ? true : false;
      // !location.href.includes() ||

      // if(is_preset_owner && is_on_owner_page) return;

      // let profile_url = `${location.origin}/core/${preset_id}`;
      let profile_url = `${location.origin}/core/${preset_alias}`;// goto project page
      console.warn("[ProfileIcon] go_to_profile url = ",profile_url);

      location.replace(profile_url);
    }// go_to_profile


    // get the image data from the preset
    let image_item = (imageStage.current == 1) ? preset_data.items.image :
    (imageStage.current == 2) ? preset_data.defaults.image :
    null;

    let extra = (exists(image_item) && exists(image_item.extra)) ? has_extra_data({extra: image_item.extra, layout: "profile"}, true) : null;// i need the profile extra or use the default

    //if i need type "verbose" && a certain layout - it won't return true unless its there. if its a legacy version it will come back true
    // let icon_image = (exists(extra) && extra.has_extra) ? image_item.extra : (exists(image_item) && exists(image_item.value)) ? image_item.value :  get_default_image();//  get user defaults instead

    let icon_image = (exists(image_item)) ? image_item.value :  get_default_image();

    // NOTE: test for stage2 image
    // let icon_image = get_default_image();// test default stage2 image

    // i need 3 stages here,
    // 1. try the desired image
    // 2. try the backup image (default)
    // 3. either use the sites default image or use a user icon instead

    // return null;
    let master_image = null;

    let accept_image = (imageStage.current != 3 || imageStage.current == 3 && fallback != "icon") ? true : false;

    let use_callback = (exists(data.callback)) ? data.callback : (exists(data.deep_dive) && typeof data.deep_dive != "boolean") ? data.deep_dive : go_to_profile;

    if (accept_image) {

      let my_icon_str = name + "_icon_img";
      let my_scale = (icon_image.includes("flame.png")) ? 1 : 2;


      let img_data = {
        varName:`${my_icon_str}`,
        url:icon_image,
        type: "profile",
        custom_class:`${my_icon_str} ${/*s.app_state.text_view*/""}`,
        canvas_class: no_class ? "" : `d3-profile-rounded`,
        image_class: no_class ? "" : `d3-profile-rounded`,
        width:100,height:100,scale:my_scale,
        mode:"image",
        stop_bubble: true,
        auto_validate: true,
        layout: ["profile","thumbnail"],
        has_error_callout: true,
        error_callout_params:[img_error,{/*state,"pId":rich_image_cont_id,*/"mod":"rich",/*"tObj":trans_obj*/}]
        // default_img: default_image
      };

      if(exists(extra) && extra.has_extra){
        img_data.extra = image_item.extra;// this is the whole thing (all the layout variations)
        img_data.mode = "auto";
        // i need to read the extra and see if the dimensions work for the display area,
        // in this case it needs profile or thumbnail or custom with the same width and height - otherwise do nothing
        // needs to use profile or thumbnail layout or default image (no extra) - can also send a different img_url (icon_image)

        //also if it has multiple images, look for the profile or thumbnail and get its extra data
      }// end if

      // let deep_dive = (s.app_state.display_data != "info" || s.app_state.display_data == "info" &&
      // tVar.myIn_data_type == "folder" || s.app_state.display_data == "info" &&
      // tVar.myIn_data_type == "preset") ? true : false;

      // let deep_dive = true;

      if(exists(deep_dive))
      {
        img_data.has_callout = "true";
        img_data.callout_params = [use_callback/*, item*/];
      }// if deep_dive


      // // add .extra = [do i need extra with thumbnails? - lets start with no]
      // [ok lets try yes - why modify images if you don't use them?]
      // extra:data.extra,

      // master_image = (
      //   <MasterImage data={img_data} />
      // ) ;
      master_image = useMemo(() => <MasterImage data={img_data} />,[img_data]);
    }// accept_image

  return (
    <div className={`${name} ProfileIcon_icon_wrapper ProfileIcon_icon_wrapper_${iUN} ${tag}`} data-comp={`ProfileIcon`} >
      { !text_only_mode && accept_image ? master_image : (
        <div className={`${name}_icon ProfileIcon_icon d3-ico d3-ico-btn icon-user`}
          key={`ProfileIcon_icon_${iUN}`}
          onClick={(e) => {
            e.preventDefault();
            e.persist();
            use_callback(e);
        }}></div>
      )
      }
    </div>
  );


  }// ProfileIcon

  export default ProfileIcon;
