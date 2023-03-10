
  const {htmlDecode} = require('./html_decode.js');
  const {bboy} = require('./stringMe.js');

  export const fido = async function(http_obj)
  {

    return new Promise(async (resolve, reject)=>{

        var urlMod = http_obj.task;
        var uploadData = http_obj.data;
        let site_origin = location.origin;//nginx fix
        let path = http_obj.path || "items";

        let cancel_obj = http_obj.obj || {};
        cancel_obj.cancelToken = axios.CancelToken.source();


        try {

          const response = await axios.post(`${location.origin}/${path}/${urlMod}`, uploadData,
          {
            cancelToken: cancel_obj.cancelToken.token
          }
          );

          let result = response.data;

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
          // catch axios cancel error
          if (axios.isCancel(e)) {
            console.warn('Request canceled', e.message);
          } else {
            // handle all other errors
            console.error(`[http.js] fido req error occured`,e);
          }
          reject();
        }

      });

  }//end fido

  export const rex = async function(http_obj)
  {
    return new Promise((resolve, reject)=>{

      let meseeks = "entering rex";

      try {

        var form_token = http_obj.token || FORM_TOKEN;
        var urlMod = http_obj.task;
        let site_url = http_obj.site || SITEURL;
        var uploadData = {...http_obj.data};
        // var uploadData = Object.assign({}, http_obj.data);
        // var uploadData = bboy(http_obj.data, true);
        let path = http_obj.path || "items";
        // let site_origin = location.origin;//nginx fix

        // var ctrl_Url = site_url + "index.php?option=com_arc&task=" + urlMod + "&format=raw&" + form_token + "=1";//this works
        // var ctrl_Url = ` ${origin}/req/post`;//this works
        var ctrl_Url = `${site_url}/api/alight/${path}/${urlMod}`;
        // var ctrl_Url =`http://localhost:3000/req/post`;//this works

        // fetch(ctrl_Url, uploadData)
        // .then(function(response) {
        //   resolve(response.text());
        // });
        let post = { title: "some text"};

        let options = {
          method:'POST',
          body:JSON.stringify(uploadData),/*fetch body needs to be stringified or server body-parser error occurs*/
          // body:uploadData),
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': form_token
          })
        }// options

        fetch(ctrl_Url,options)
        .then(function(response) {
          resolve(response.text());
        });

      } catch (e) {
        console.error(`[http.js] rex error occured`,e);
        reject();
      }
    });
  }

  export const champ = async function(http_obj)
  {
    return new Promise((resolve, reject)=>{

      let meseeks = "entering champ";

      try {

        var form_token = http_obj.token || FORM_TOKEN;
        var urlMod = http_obj.task;
        let site_url = http_obj.site || SITEURL;
        var uploadData = {...http_obj.data};
        // var uploadData = Object.assign({}, http_obj.data);
        // var uploadData = bboy(http_obj.data, true);
        let path = http_obj.path || "items";
        let url = http_obj.url || false;
        // let site_origin = location.origin;//nginx fix

        // var ctrl_Url = site_url + "index.php?option=com_arc&task=" + urlMod + "&format=raw&" + form_token + "=1";//this works
        // var ctrl_Url = ` ${origin}/req/post`;//this works
        var ctrl_Url = (url) ? url : `${site_url}/api/alight/${path}/${urlMod}`;
        // var ctrl_Url =`http://localhost:3000/req/post`;//this works

        // fetch(ctrl_Url, uploadData)
        // .then(function(response) {
        //   resolve(response.text());
        // });
        let post = { title: "some text"};

        let options = {
          method:'POST',
          body:JSON.stringify(uploadData),/*fetch body needs to be stringified or server body-parser error occurs*/
          // body:uploadData),
          headers: new Headers({
            'Access-Control-Allow-Origin':'*',
            'Content-Type': 'application/json'/*,
            'Authorization': form_token*/
          })
        }// options

        fetch(ctrl_Url,options)
        .then(function(response) {
          resolve(response.text());
        });

      } catch (e) {
        console.error(`[http.js] champ error occured`,e);
        reject();
      }
    });
  }



// `https://sunzao.us/core/${urlMod}`
