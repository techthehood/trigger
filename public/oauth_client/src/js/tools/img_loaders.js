

export const img_error = function(ie_Obj){

    var state = ie_Obj.state;
    var prev_id = "#" + ie_Obj.pId;
    var url_display_type = ie_Obj.mod;
    var trans_obj = ie_Obj.tObj;
    var chron = ie_Obj.chron;
    $(prev_id).addClass("arc_flame");

    //why isn't this exposed for all instances?
    let canvas = document.getElementsByClassName("arc_rich_img")[0];
    let can_par = canvas.parentNode;
    can_par.innerHTML = "";
    // delete state.object_elements.rich_img;
    //state.object_elements.rich_img.setUrl(window['ARC_IMG_URL'] + "flame.png");
    //state.object_elements.rich_img.display();

    if(chron == "new"){
      //checkChange("","",{state, "mode":"validate"},trans_obj);
    }//end if

    if(url_display_type == "rich" /*&& state.object_elements.meta_data.image != undefined*/)
    {
      //setErrorCallout
      //state.object_elements.rich_img.setUrl(window['ARC_IMG_URL'] + "flame.png");
      //state.object_elements.rich_img.display();

      //delete state.object_elements.rich_img;
      // delete state.object_elements.meta_data.image;
      //checkChange("","",{state, "mode":"validate"},trans_obj);
    }// if

    // checkChange("","",{state, "mode":"validate"},trans_obj);//why isn't this exposed for all instances?

}//end img_error

export const img_success = function(is_Obj)
{
  //arc_activate_window();
  var state = is_Obj.state;
  var prev_id = "#" + is_Obj.pId;
  var trans_obj = is_Obj.tObj;
  var chron = is_Obj.chron;
  var success_image = is_Obj.img;
  $(prev_id).removeClass("arc_flame");
  // state.object_elements.meta_data.image = success_image;

  // state.object_elements.rich_hidden_meta.value = saveMetaValue(state.object_elements.meta_data);


  if(chron == "new"){
    //checkChange("","",{"mode":"validate"});

    // checkChange("","",{state, "mode":"validate"},trans_obj);

  }//end if

}//end img_success
