
import React from 'react';
import PassportStore from "./passportStore";

const PassportContext = React.createContext();

const PassportProvider = (props) => {
  return (
    <PassportContext.Provider value={props.store ? props.store : PassportStore} PassportStore={props.store ? props.store : PassportStore} >
      {props.children}
    </PassportContext.Provider>
  );
}

export {
  PassportProvider,
  PassportContext
}
