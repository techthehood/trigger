  // const puppeteer = require("puppeteer");
  const request = require("request");
  const cheerio = require("cheerio");
  const chalk = require('chalk');
  const display_console = true;

  const get_site_data = async (obj, callback) => {

    let url = obj.url;

    let meta_data = "";

    if(display_console) console.log("get_site_data url = ",url)
    // if(display_console) console.log("puppeteer = ", puppeteer);
    let has_error = false;
    let error_msg = "";

    // const browser = await puppeteer.launch({headless: true,devtools: true});



try{
      // .catch(err => {
      // const page = await browser.newPage();
      //   has_error = true;
      //   error_msg = `puppeteer launch error ${err}`;
      // })
      //
      // if(has_error == true){
      //   if(display_console) console.error("[browser] launch",error_msg);
      //   await browser.close();
      //   if(display_console) console.error("[browser] closed: launch");
      //   return callback(error_msg,null);
      // }

    // try{
    // }catch(err){
    //   return callback(`puppeteer launch error ${err}`,null);
    // }

      // .catch(err => {
      //   has_error = true;
      //   error_msg = `browser newPage error ${err}`;
      // })
      //
      // if(has_error == true){
      //   if(display_console) console.error("[browser] newpage",error_msg);
      //   await browser.close();
      //   if(display_console) console.error("[browser] closed: newpage");
      //   return callback(error_msg,null);
      // }
    // try{
    // }catch(err){
    //   return callback(`browser newPage error ${err}`,null);
    // }


    if(display_console) console.log("[goto time stamp] ",Date());
    // await page.goto(url, {waitUntil: 'networkidle2'})
    // await page.goto(url)//
    // await page.goto(url, {waitUntil: 'domcontentloaded',timeout:15000})//
    // .catch(err => {
    //   has_error = true;
    //   error_msg = `page goto error ${err}`;
    // });
    //
    // if(has_error == true){
    //   if(display_console) console.error("[browser] page goto",error_msg);
    //   await browser.close();
    //   if(display_console) console.error("[browser] closed: page goto");
    //   return callback(error_msg,null);
    // }

    // await page.waitForSelector("body",{visible:true})
    // .catch(err => {
    //   has_error = true;
    //   error_msg = `waitForSelector error ${err}`;
    // });
    //
    // if(has_error == true){
    //   if(display_console) console.error("[browser] waitForSelector",error_msg);
    //   await browser.close();
    //   if(display_console) console.error("[browser] closed: waitForSelector");
    //   return callback(error_msg,null);
    // }

    // await page.waitForSelector('meta');

    // try{
    // }catch(err){
    //   return callback(`page goto error ${err}`,null);
    // }
    // const html = await page.content()
    // .catch(err => {
    //   has_error = true;
    //   error_msg = `page content error ${err}`;
    // })


    // page.on('if(display_console) console', msg => {
    //   if(display_console) console.log("[page.on if(display_console) console] ",msg.text());
    // });

    // page.on('if(display_console) console', msg => {
    //   msg.args.forEach((arg,ndx) => {
    //     if(display_console) console.log(`${ndx}: ${arg}`);
    //   });
    // });

    // const meta_data = await page.evaluate(async () => {
      // treat this like im in an iframe - if(display_console) consoles don't register outside - vars arent accessed inside
      //properties
      await request(url, async (error, response, html) => {

        if(error){
          console.log(chalk.red("[request] response error"),error);
          return callback(error,null);
        }

      // if(display_console) console.log("[request] response",response);
      // if(display_console) console.log("[request] html",html);

      $ = await cheerio.load(html);
      // if(display_console) console.log("[cheerio]", $);
      if(display_console) console.log("[request] ",Date());

      let meta_obj = {};
      let data_array = ["title","image","description"];

      //check meta tags
      // let head = document.querySelector("head");// can i speed this up by only looking in the head section?
      // let meta_els = document.querySelectorAll("meta");
      // let meta_els = head.querySelectorAll("meta");
      if(display_console) console.log("[pre select] ",Date());
      // let meta_els = document.querySelectorAll(`
      //   meta[property^='og:'],
      //   meta[property^='twitter:'],
      //   meta[itemprop='title'],
      //   meta[itemprop='description'],
      //   meta[itemprop='image']`
      // );//
      let meta_els = $(`
        meta[property^='og:'],
        meta[property^='twitter:'],
        meta[itemprop='title'],
        meta[itemprop='description'],
        meta[itemprop='image']`
      );//
      if(display_console) console.log("[select finished] ",Date());
      // return JSON.stringify(meta_els);
      // return meta_els[7].outerHTML;
      // get og: data

      //parse meta tags
      // if(display_console) console.log("[meta_els]",meta_els);
      meta_els = Array.from(meta_els);
      if(display_console) console.log("[meta_els] array ",meta_els);
      last_ndx = 0;
      if(meta_els.length > 0){
        if(display_console) console.log(`[meta_el length] ${meta_els.length}`);
        await meta_els.some((mdata,ndx) => {
          // return meta_obj[ndx] = mdata.outerHTML;
          // return meta_obj[ndx] = mdata.getAttribute("property");
          // they don't all have property - i only want the ones that do

          //prioritize og: and twitter: data - (found in property)
          // let m_prop = mdata.getAttribute("property");
          let m_prop = mdata.attribs["property"];

          //if its blank or its not og: or twitter:
          if(m_prop == null || m_prop.indexOf("og:") == -1 && m_prop.indexOf("twitter:") == -1){
            ///try the itemprop
            if(display_console) console.log("[itemprop]",mdata.attribs);
            m_prop = mdata.attribs["itemprop"];
          }

          if(m_prop == null){
            if(display_console) console.log("[m_prop] is null");
            return;
          }

          if(display_console) console.log(`prop = ${m_prop}`);
          // if(display_console) console.log(`snippet = ${m_prop} ${mdata.content}`);// works but tmi


          if(m_prop.indexOf("og:") != -1){
            // prioritized og: over twitter:
            let obj_key = m_prop.replace("og:","");
            if(display_console) console.log("[obj_key]",obj_key);
            // return meta_obj[ndx] = m_prop;//works
            // return meta_obj[ndx] = obj_key;//works
            // return meta_obj[ndx] = m_prop.content;
            if(!meta_obj[obj_key] && mdata.attribs.content != "" && data_array.includes(obj_key)){
              //if it doesn't already exit
              meta_obj[obj_key] = mdata.attribs.content;
            }
          }else if(m_prop.indexOf("twitter:") != -1){
            let obj_key = m_prop.replace("twitter:","");
            if(display_console) console.log("[obj_key]",obj_key);
            if(!meta_obj[obj_key] && mdata.attribs.content != "" && data_array.includes(obj_key)){
               meta_obj[obj_key] = mdata.attribs.content;
            }
          }else if(data_array.includes(m_prop)){
            //if its found in the array use it
            let obj_key = m_prop;
            if(!meta_obj[obj_key] && mdata.attribs.content != ""){
               meta_obj[obj_key] = mdata.attribs.content;
            }
          }//else if
          last_ndx = ndx;
          return (meta_obj[`${data_array[0]}`] &&
            meta_obj[`${data_array[1]}`] &&
            meta_obj[`${data_array[2]}`]) ? true : false;
        });

        if(display_console) console.log(`[last ndx =  ${last_ndx}]`);
        let meta_str = JSON.stringify(meta_obj);
        if(display_console) console.log(`[meta data] ${meta_str}`);
        if(display_console) console.log("[process finished] ",Date());
        // return meta_str;
        meta_data = meta_str;
        if(display_console) console.log("[meta_data] if(display_console) console",meta_data);

        if(display_console) console.log("[meta_data] returning");
        return callback(null,meta_data);
      }else{
        JSON.stringify({error:"no meta data available"});// callback is not defined here?
        return callback("no meta data available",null);
      }
    // })// page.evaluate
    })// request

    // .catch(err => {
    //   has_error = true;
    //   error_msg = `page evaluate error ${err}`;
    // })
    //
    // if(has_error == true){
    //   if(display_console) console.error("[browser] page evaluate ",error_msg);
    //   await browser.close();
    //   if(display_console) console.error("[browser] closed: page evaluate");
    //   return callback(error_msg,null);
    // }

    // try{
    // }catch(err){
    //   return callback(`page content error ${err}`,null);
    // }
    // await page.close();
    // if(display_console) console.log("[browser] regular browser close");
    // if(display_console) console.log("[browser] browser close");
    //
    // // return callback(null,html);
    // if(display_console) console.log("[meta_data] returning");
    // return callback(null,meta_data);
  }catch(err){
    console.log(chalk.red("[browser] error"),err);
      try{
        //if the site doesn't exist browser will be undefined
        // await browser.close();
      }catch(err2){
        console.log(chalk.red("[browser] error closing browser"),err2)
      }
      console.log(chalk.red("[browser] browser close"));
      // return callback(null,html);
      return callback(err,null);
  }

  }//get_site_data

  module.exports = get_site_data;

  // try{
  // }catch(err){
  // }
