import React from 'react';
import TriggerStore from "./triggerStore";

const TriggerContext = React.createContext();

const TriggerProvider = (props) => {
  return (
    <TriggerContext.Provider value={props.store ? props.store : TriggerStore} TriggerStore={props.store ? props.store : TriggerStore} >
      {props.children}
    </TriggerContext.Provider>
  );
}

export {
  TriggerProvider,
  TriggerContext
}