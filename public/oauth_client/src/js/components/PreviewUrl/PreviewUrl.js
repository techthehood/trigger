  import { useEffect, useState, useContext, Fragment, useRef } from 'react';
  // import MasterImage from '../../../../../../core/d3po_ITKR/src/app.d3po_ITKR';
  import MasterImage from '@sunzao/d3po_itkr';
  // import MasterImage from '@sunzao/d3po_itkr';
  // import MasterImage from '@sunzao/d3po_itkr/d3po_ITKR.js';
  // NOTE: counting relative paths - whatever dir i need to be in, i need to count to the folder inside the folder i want not the folder itself
  // so start the count from the folder you want to be in to the last directory on the right b4 the current file

  const {exists} = require('../../tools/exists.js');
  const {htmlDecode} = require('../../tools/html_decode.js');
  const {copy_me} = require('../../tools/copy_me.js');
  const {img_success, img_error} = require('../../tools/img_loaders.js');
  require('./PreviewUrl.scss');

  // import img_success && img_error
  /*
  * formerly MakeRichDisplay
  */

  const PreviewUrl = (props) =>
  {
    // NOTE: GOTCHA: escape and unescape was causing img urls to fail
    
    let data = props.data;
    let data_obj_str = data.meta_data;

    // IMPORTANT: needs setting - tells whether its in edit mode or not
    // actually mostly its not a display - its only a display in details view right now. otherwise when its in a form its default
    let setting = data.setting || "default";
    // let backup_url = data.url;// backup_img?
    let iUN = data.iUN ||  Math.round(Math.random() * 10000);

    const form_data = (setting == "form" && typeof form_data != "undefined") ? props.data.form : "";
    let register = (setting == "form" && typeof form_data != "undefined") ? form_data.register : "";
    let getValues = (setting == "form" && typeof form_data != "undefined") ? form_data.getValues : "";
    let setValue = (setting == "form" && typeof form_data != "undefined") ? form_data.setValue : "";


    let meta_data = data.meta_data;
    let trans_obj = data.tObj || "";
    let chron = data.chron || "current";//for existing meta_data or new meta_data(ajax)

    const title_limit = 90;
    const url_limit = 500;
    const desc_limit = 150;

    //turn the string into an object
    //console.dir(data_obj_str);
    //JSON.parese doesn't like single quotes
    // This returns "<img src='myimage.jpg'>"
    if(chron == "current"){
      //this section fixes double quotes coming from the db in the form of &quot;
      meta_data = htmlDecode(meta_data);
      //console.dir(meta_data);
    }//end if chron

    if(setting == "display" && chron == "new")
    {
      //modify chron to avoid running checkChange when the elements aren't present
      //i have an update that will eliminate this issue
      chron = setting;
    }//end if

    // let has_data = "false";
    let meta_title = "No preview available";
    let meta_obj = {title:"No preview available"};

    // let its_nothing = (meta_data == "" || meta_data == "{}" || meta_data.indexOf("<b>Fatal error</b>") != -1 || meta_data.indexOf("|*:|data unavailable|*:|") != -1 || meta_data.indexOf("<title>404 Not Found</title>") != -1) ? true : false;
    if(typeof meta_data == "string" && (meta_data == "" || meta_data == "{}" || meta_data.indexOf("<b>Fatal error</b>") != -1 || meta_data.indexOf("|*:|data unavailable|*:|") != -1 || meta_data.indexOf("<title>404 Not Found</title>") != -1)){
      //no preview available
      // let has_data = "false";
      // let meta_title = "No preview available";
    }else
    {
      try {
        meta_obj = (typeof meta_data == "string") ? JSON.parse(meta_data) : meta_data;
      } catch (e) {
        // if i can't parse its probably not valid json - if that happens do this
        meta_obj = {title:"No preview available"};
      }

      if(meta_obj.error){
        //do nothing
        meta_obj = {title:"No preview available"};
      }else{
        // has_data = meta_obj.has_data || "";
        meta_title = meta_obj.title || "";
        meta_title = htmlDecode(meta_title);
      }
    }//end else indexOf

    meta_title = unescape(meta_title);

    // let meta_url = meta_obj.url || "";
    // meta_url = htmlDecode(meta_url);

    let meta_description = meta_obj.description || "";
    meta_description = htmlDecode(meta_description);
    meta_description = unescape(meta_description);

    let meta_image = meta_obj.image || "";
    // meta_image = htmlDecode(meta_image);


    // what if there is no meta_title
    if(meta_title != "")
    {
      //prepare a container
      // state.object_elements.meta_data = {};
      //add the title to the input

      //modify the data to a max limit

      meta_title = (meta_title.length > title_limit) ? meta_title.slice(0,title_limit) : meta_title;

      }//end if meta_title
      //this was moved so they work independently of each other if needed - rare

    if(meta_image != "")
    {
      meta_image = (meta_image.indexOf("https") == -1) ? meta_image.replace("http","https") : meta_image;


      meta_image = (meta_image.length > url_limit) ? meta_image.slice(0,url_limit) : meta_image;

    }else if(chron == "new"){
      //this activates a check change even if there is no image data to wait for.
      //waiting for the image in this case is not really neccesary but...
      // checkChange("","",{state, "mode":"validate"},trans_obj);
    }

      meta_description = (meta_description.length > desc_limit) ? meta_description.slice(0,desc_limit) : meta_description;

    if(typeof data.callback != "undefined"){
      data.callback({ meta_title, meta_image, meta_description});
    }


    /******* new elements section *******/

    //create a title element for the preview title
    let add_no_value = (meta_title == "No preview available") ? "no_preview" : "";
    let rich_title = (meta_title != "") ? (
      <p id={`rich_title${iUN}`} className={`rich_title${iUN} rich_title ${add_no_value}`} title="rich preview" >{meta_title}</p>
    ) : null;// can i set a max length on a p element? rich_title.setMaxLength(90);

    let meta_img_data = (meta_image != "") ? {
      /*home:rich_image_cont_id,*/varName:'rich_img',url:meta_image,type:"profile",
      width:200,height:100,scale:2,mode:"image",
      auto_validate: false,
      custom_class:"rich_img fit-cover",
      has_load_callout: "true",
      load_callout_params:[img_success,{/*state,"pId":rich_image_cont_id,*/"chron":chron,/*"tObj":trans_obj,*/"img":meta_image}],
      has_load_callout:"true",
      error_callout_params:[img_error,{/*state,"pId":rich_image_cont_id,*/"mod":"rich","chron":chron,/*"tObj":trans_obj*/}]
    } : {}; // does it need state or store?
    // does this entire fn component rerun on render
    //[seems like yes ](https://stackoverflow.com/questions/46736983/will-a-stateless-component-re-render-if-its-props-have-not-changed/46737063)
    // ISSUE: can i set no image on error? - fix rich preview broken images

    if(exists(data.error_callout)){
      let error_data = data.error_data || {}
      meta_img_data.auto_validate = false;
      meta_img_data.has_error_callout = true;
      meta_img_data.error_callout_params = [data.error_callout, error_data];
    }// if

    let rich_copy_btn = (setting == "form") ? (
      <button id={`rich_image_copy_btn${iUN}`}
      className={`rich_image_copy_btn icon-copy d3-ico d3-disc d3-disc d3-disc-outer d3-disc-bg `}
      title="copy image to clipboard"
      onClick={function(e)
        {
          e.preventDefault();
          // copy image to clipboard
          // create the textarea
          copy_me(e, meta_image);

        }}></button>
      ) : null;

    let rich_image_cont = (meta_image != "") ? (
      <div id={`rich_image_cont${iUN}`} className={`rich_image_cont${iUN} rich_image_cont`} title="rich preview container" >
        {rich_copy_btn}
        <MasterImage data={meta_img_data} />
      </div>
    ) : null;


    let desc_btn_icon_class = "ui-btn ui-btn-right ui-btn-inline ui-shadow ui-corner-all ui-mini ui-icon-nope ui-btn-icon-right ui-btn-icon-notext ";
    let rich_desc_btn = (setting == "form" && meta_description != "") ? (
      <button id={`rich_desc_btn${iUN}`} className={`rich_desc_btn${iUN} rich_desc_btn ${desc_btn_icon_class}`}
      onClick={function(e)
      {
        e.preventDefault();
        //let rich_desc_el = (document.getElementById("rich_desc_cont")) ? document.getElementById("rich_desc_cont") : document.getElementsByClassName("rich_desc_cont")[0];
        //let richie_rich = rich_desc_el.parentNode;
        let richie_rich = this.parentNode.parentNode;// may need e.target instead of this.
        richie_rich.removeChild(this.parentNode);
        // delete state.object_elements.meta_data.description;
        // LATER: delete description somehow, trigger a render - how do you delete from the store? - in this case its a string so it something else entirely
      }}
      >delete</button>
    ) : null;


  // state.database_alt_pair.meta_data = "meta_data";


      let rich_desc_cont = (meta_description != "") ? (
        <div id={`rich_desc_cont${iUN}`} className={`rich_desc_cont${iUN} rich_desc_cont`} >
          {rich_desc_btn}
          <p id={`rich_description${iUN}`} className={`rich_description${iUN} rich_description word_wrap `}
          title="rich description"
          >{meta_description}</p>
        </div>
      ) : null;// setMaxLength(150)


    let rich_cont = (
      <div id={`rich_cont${iUN}`} className={`rich_cont${iUN} rich_cont`} data-comp={`PreviewUrl`} >
        <div id={`rich_box${iUN}`} className={`rich_box${iUN} rich_box ${add_no_value}`} title="rich preview" >
          {rich_title}
          {rich_image_cont}
          {rich_desc_cont}
        </div>
      </div>
    );


    // i may need a fragment to wrap these elements
    return (
      <Fragment>
        {rich_cont}
      </Fragment>
    )


      //arc_activate_window();
  }//end make_rich_display

export default PreviewUrl;
