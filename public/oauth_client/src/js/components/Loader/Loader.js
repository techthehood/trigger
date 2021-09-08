import React, { useRef, useEffect, useState, forwardRef } from 'react';
const {class_maker} = require('../../tools/class_maker');
require('./Loader.scss');

const Loader = forwardRef(({
  type,
  prefix = "",
  name = "",
  iUN,
  variants = "",
  inner = {},
  children,
  ...rest
},ref) => {

  if(ref != undefined) rest.ref = ref;
  
  // variants are whatever you want to appear in the classname  of the loader wrapper
  // inner_variant is for variants set in the inner property for the actial loader element(s)
  const {variants: inner_variants = "", ...inner_rest} = inner;

  const iUN_ref = useRef(Math.round(Math.random() * 10000));
  iUN = (typeof iUN == "undefined") ? iUN_ref.current : iUN;

  let loader_display;

  switch (type) {
    case "bounce":
    case "dots":
      loader_display = (
        <div className={`${class_maker({prefix,name,main:"bounce-loader",iUN})} ${inner_variants}`} {...inner_rest} >
          <div className={class_maker({prefix,name,main:"bounce1",iUN})}></div>
          <div className={class_maker({prefix,name,main:"bounce2",iUN})}></div>
          <div className={class_maker({prefix,name,main:"bounce3",iUN})}></div>
        </div>
      );
      break;
    case "spin":
    case "spinner":
    default:
      loader_display = (
        <div className={`${class_maker({prefix,name,main:"loader",iUN})} ${inner_variants}`} {...inner_rest}>
          {children}
        </div>
      );
      /*<div className={class_maker({prefix,name,main:"loader_wrapper",iUN})} ref={observer}
        onClick={(e) => { observer(e.target,true); }}  data-observer="loader">*/
  }
  return (
    <div className={`${class_maker({prefix,name,main:"loader_wrapper",iUN})} ${variants}`} 
    data-comp={`Loader`}
    {...rest} 
    data-comp={`Loader`} >
      {loader_display}
    </div>
  );
});

export default Loader;
