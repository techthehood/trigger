const { get_device } = require('./get_device.js');
const { BrowserView, MobileView, isBrowser, isMobile } = require("react-device-detect");

// const device_size = get_device({ mode: "size" });
// let device_type = state.size_ary[`${state.device_size}`];
// console.log('device_size', device_size);
console.log('window.innerWidth', window.innerWidth);
// window.innerWidth

const unButton = {
  border: 'none',
};

const mediaMngr = {
  ...unButton,
  borderRadius: '50%',
  backgroundColor: 'unset',
  height: '3rem',
  width: '3rem',
  fontSize: '2.5rem',
  cursor: 'pointer',
  outline: 'unset'
};

const callBtnDefaults = {
  ...unButton,
  gridArea: 'call',
  width: '6rem',
  height: '3rem',
  alignSelf: 'center',
  justifySelf: 'center',
  cursor: 'pointer',
  color: 'white',
}

const controls = {
  width: '100%',
  padding: '.5rem',
  position: 'fixed',
  zIndex: 3,
  backgroundColor: "rgb(0 0 0 / 36%)",
  backdropFilter: "blur(2px)",
}

let sSWidth = isMobile || window.innerWidth < 600 ? '40%' : window.innerWidth < 800 ? '30%' : '20%';
let sSLeft = isMobile || window.innerWidth < 600 ? '55%' : window.innerWidth < 800 ? '65%' : '75%';

const Styles = {
  bg_style: {
    display: 'grid',
    gridTemplateAreas: '"header" "video" "footer"',
    gridTemplateRows: 'auto 9fr auto',
    gridTemplateColumns: '1fr',
    justifyContent: 'center',
    alignContent: 'center',
    // padding:'1rem',
    width: '100%',
    // height: '80%',
    height: '100%',
    backgroundColor: 'black',
    position: 'relative',
    // display: 'block',
  },
  header: {
    ...controls,
    display: 'grid',
    gridTemplateAreas: '"users . code options"',
    gridTemplateColumns: '1fr 9fr 1fr 1fr',
    gridArea: 'header',
    top: 0,
    zIndex: 4,
  },
  footer: {
    ...controls,
    gridArea: 'footer',
    display: 'grid',
    gridTemplateAreas: '"mute . call options"',
    gridTemplateColumns: '7fr 3fr 4fr 1fr',
    bottom: 0,
  },
  bigScreen: {
    width: '100%',
    height: '100%',
    // maxWidth: '800px',
    // height: 240,
    // margin: 5,
    backgroundColor: '#282828',
    // position: 'absolute',
    objectFit: 'cover',
    justifySelf: 'center',
    alignSelf: 'center',
    zIndex: 1,
    aspectRatio: '2 / 1',
    gridArea: 'video',
  },
  smallScreen: {
    // width: device_size < 500 ? '40%' : '18%',
    width: sSWidth,
    // width:'18%',
    // height: 100,
    // margin: 5,
    objectFit: 'cover',
    backgroundColor: '#282828',
    position: 'absolute',
    zIndex: 2,
    aspectRatio: '4 / 3',
    cursor: 'pointer',
    display: 'block',
    bottom: '20%',
    left: sSLeft,
  },
  mediaSection: {
    gridArea: 'mute',
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    gap: '1rem',
  },
  offerBtn: {
    ...callBtnDefaults,
    backgroundColor: 'blue',
    // display: !init ? 'block' : 'none',
  },
  answerBtn: {
    ...callBtnDefaults,
    backgroundColor: 'green',
    // display: init && !connected ? 'block' : 'none',
  },
  leaveBtn: {
    ...callBtnDefaults,
    backgroundColor: 'red',
    // display: init && !connected ? 'block' : 'none',
  },
  audioMngr:{
    ...mediaMngr,
  },
  videoMngr:{
    ...mediaMngr,
  },
  mediaOuter: {
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaLabel:{
    color: 'white',
    fontSize: '.9em',
    margin:'unset',
    fontFamily: 'arial',
  },
}// Styles

export {
  Styles,
}


// module.exports = {
//   Styles,
// }

// [GOTCHA: Uncaught TypeError: Cannot assign to read only property 'exports' of object '#<Object>'](https://flaviocopes.com/cannot-assign-readonly-property-export/)