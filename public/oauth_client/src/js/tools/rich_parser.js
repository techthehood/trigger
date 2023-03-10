

	export const rich_parser = function(tUrl, cancel_obj = {})
  {
    // takes only a url and sets up a request
    return new Promise( async (resolve, reject)=>{

      var uploadData = {};


      uploadData.url = tUrl;
			let task = "getPreviewData";
      //console.log(uploadData);

      await fido({ task, data: uploadData, cancel_obj})
      .then((results) => {
        console.log("parse results = ",results);
        resolve(results);
      })
      .catch(err => {
        reject(err);
      });

    })//end promise function

  }//end rich_parser

  export const fido = async function(http_obj)
  {

    return new Promise(async (resolve, reject)=>{
        var urlMod = http_obj.task;
        var uploadData = http_obj.data;
        let site_origin = location.origin;//nginx fix
        let path = http_obj.path || "users";

        // var ctrl_Url = "index.php?option=com_arc&task=" + urlMod + "&format=raw&" + form_token + "=1";//this works
        // var ctrl_Url = `${site_origin}/index.php?option=com_arc&task=${urlMod}&format=raw&${form_token}=1`;//this works

        try {

        let cancel_obj = http_obj.cancel_obj ? http_obj.cancel_obj : http_obj.obj ? http_obj.obj : {};
        cancel_obj.cancelToken = axios.CancelToken.source();

          const response = await axios.post(`${location.origin}/api/trigger/${path}/${urlMod}`, uploadData,
          {
            cancelToken: cancel_obj.cancelToken.token
          });

          let result = response.data;

          //console.log("scan textStatus = " + textStatus);
          //console.log("scan xhr  = " + xhr);
          //console.info("scan xhr status = " + xhr.status);

          //alert("Ajax test result data = " + result);//string
          console.log("Ajax test result data = " + result);//string
          //var makeMenu = new menuMaker(result);
          //makeMenu.display();

          //if upload is successful

          //change the upload icon to successful

          if(result.error != undefined)
          {
            let err_result = (typeof result == "string") ? htmlDecode(result) : result;// error object doesn't work will with htmlDecode
            reject(err_result);

          }else{

            resolve(result);//remove the php htmlentities (js version of - html_entity_decode)

          }//else
        } catch (e) {
          let e_txt, e_mode;
          if (axios.isCancel(e)) {
            e_mode = "cancel";
            e_txt = '[rich_parser] fido request canceled';
            console.warn(e_txt, e.message);
            resolve({ mode: e_mode, text: e_txt, message: e.message, error: true });
            // GOTCHA: WARNING!!! don't reject the cancel if it is rejected it could crash the component making the request
          } else {
            // handle all other errors
            e_mode = "error";
            e_txt = `[rich_parser] fido req error occured`;
            console.error(e_txt, e);
            reject({ mode: e_mode, text: e_txt, message: e.message });
          }
        }

      });

  }//end fido
