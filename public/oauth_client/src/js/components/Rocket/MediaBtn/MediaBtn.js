import React, { useRef, useEffect, useState } from 'react';

const MediaBtn = ({
  outer = {},
  label = {},
  custom,
  callback,
  inner = {},
  text,
}) => {
  
  return (
    <div style={{...outer}}>
      <button className={custom} type="button" onClick={callback} style={{...inner}} ></button>
      <p style={{...label}}>{text}</p>
    </div>
  );
}// MediaBtn
  
export default MediaBtn;