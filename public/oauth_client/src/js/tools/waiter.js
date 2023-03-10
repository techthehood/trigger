// console.log(`wait a min running!`);
// import {wait_a_minute} from './lib/tools/wait_a_minute.js';
// const {wait_a_minute} = require('./lib/tools/waiter');

export const wait_a_minute = function(mod,txt,dImg)
{
  //global scope function

  var modify = mod || "show";
  var display_txt = txt || "Uploading Data...";
  var display_img = (dImg == undefined || dImg == "cloud") ? "cloud.gif" :
  (dImg == "flame") ? "L7loader_wht.gif" : dImg;

  let loading_modal = document.querySelector(".loading_modal");

  if(modify == "show"){
    // $.mobile.loading("show",{theme:"a",textVisible:true,"text":"loading...",
    // html:"<div class='L7loader'><img id='L7img' class='L7img' src='"
    // + COMP_IMG_URL + display_img + "' /><p id='loaderMsg'>" + display_txt + "</p></div>"});

    const loading_content = `
                            <div class='L7loader'>
                            <img id='L7img' class='L7img' src='${IMG_URL + display_img}' />
                            <p id='loaderMsg'>${display_txt}</p>
                            </div>`;

    loading_modal.innerHtml = loading_content;
    loading_modal.classList.add("loading");

    document.ondblclick = function(){/*$.mobile.loading("hide");*/ loading_modal.classList.remove("loading");}
  }else{

    // $.mobile.loading("hide");
    loading_modal.classList.remove("loading");
  }

}//end wait_a_minute

export const wait_a_second = function({action,txt,img,seconds = 2} = {})
{
  var modify = action || "show";
  let spinner = document.querySelector(".loader_modal");
  switch (modify) {
    case "show":
        spinner.classList.add("active");
      break;
    case "flash":
        let time = seconds * 1000;
        spinner.classList.add("active");
        setTimeout(function () {
          spinner.classList.remove("active");
        }, time);
      break;
    default:
        spinner.classList.remove("active");
  }

  document.addEventListener("dblclick",function(){/*$.mobile.loading("hide");*/ spinner.classList.remove("active");})
}
