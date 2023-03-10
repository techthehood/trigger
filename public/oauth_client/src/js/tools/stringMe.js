
  // const {stringMe} = require('../tools/stringMe.js');


  export const stringMe = function (ref_obj, objectify) {

    /**** experimental = clears circular structure ****/
    let cache = [];
     let ret_var = JSON.stringify(ref_obj, function(key, value) {
         if (typeof value === 'object' && value !== null) {
               if (cache.indexOf(value) !== -1) {
                   // Duplicate reference found
                   try {
                       // If this value does not reference a parent it can be deduped
                       return JSON.parse(JSON.stringify(value));
                   } catch (error) {
                       // discard key if value cannot be deduped
                       return;
                   }
                }
               // Store value in our collection
               cache.push(value);
           }// if
           return value;
       });
     cache = null;// Enable garbage collection
     /**** experimental = clears circular structure ****/

     if(objectify){
       return JSON.parse(ret_var);
     }else{

       return ret_var;
     }

  }// string_me

    export const bboy = function(dObj)
    {
      return JSON.parse(JSON.stringify(dObj));
    }//bboy
