// const url_tool = require('url');
const get_site_data =  require('./getData/get_site_data.js');
const get_youtube_data = require('./getData/get_youtube_data.js');
const display_console = false;
var URL = require('url').URL;

const getPreviewData = async function (req, res)
{
  // constroller - distribute by task
  try {

    if (display_console || false) console.log("[getPreviewData] req/post req.body",req.body);
    let obj = req.body;
    let task = obj.task;


    //run node puppet
    let url = obj.url;
    const youtube_array = ["youtube.com","youtu.be"];

    // let url_obj = url_tool.parse(url,true);

    if (display_console || false) console.log("[getPreviewData] url", typeof url);

    // send back a message if there's no url
    // ISSUE: empty urls should even get this far
    if(typeof url == "undefined" || url == "") return res.send({error:true,message:"no url was detected"});

    let url_obj = new URL(url);

    let host = url_obj.host;
    if (display_console || false) console.log("[getPreviewData] host", host);

    if(display_console) console.log(`[url obj] = ${JSON.stringify(url_obj)}`);

    let is_youtube = youtube_array.some((entry) => {
      return host.includes(entry);
    });

    let site_type = (is_youtube) ? "youtube" : "other";

    if(display_console) console.log("url = ",url);
    switch (site_type) {
      case "youtube":

      url = url.replace("watch?v=","");

      if(url.indexOf("?" != -1)){
        // remove time data from url
        url_ary = url.split("?");
        url = url_ary[0];
      }

      get_youtube_data({url},(error,ret_obj) => {

        if(error){
          console.log(error);
          return res.send({error:true,message:error});
        }

        return res.send(ret_obj);
      });//get_youtube_data
      break;
      default:

      get_site_data({url},(error,ret_obj) => {

        if(error){
          console.log(error);
          return res.send({error:true,message:error});
        }

        return res.send(ret_obj);
      });//get_site_data

    }// switch
  } catch (e) {
       console.log("[getPreviewData] an error occured ",e);
      return res.send({error:true,message:e});
  }

}//getPreviewData

module.exports = getPreviewData;
