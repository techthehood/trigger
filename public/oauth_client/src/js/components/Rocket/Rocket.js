import /*React,*/ { useRef, useEffect, useState, useContext } from 'react';
import { BrowserRouter, Link } from 'react-router-dom';
import io from 'socket.io-client';
import useDrag from './useDrag';
import MediaBtn from './MediaBtn';
import ProfilePanel from '../ProfilePanel';
import QRCoder from '../QRCoder';
// import {BrowserView,MobileView,isBrowser,isMobile} from "react-device-detect";
import { TriggerContext } from '../../triggerContext';
import Contacts from '../Contacts/Contacts';
import Dashboard from '../dashboard/Dashboard';

const { Styles } = require('./styles');
// require('../../icomoon/style.scss');
// const io = require('socket.io-client')('https://example.com/');// failed
require('./style.scss');

// import Routes from './Routes';

const display_console = false;
const dev_mode = true;

let socket;

const App = (props) => {

  // DOCS: reference to video elements
  const videoRef = useRef();
  const remoteVideoRef = useRef();

  const appContainer = useRef();
  const textRef = useRef();
  const pc_ref = useRef();
  const candidates = useRef([]);
  const remote_stream = useRef();
  const main_stream = useRef();
  const [miniMain, setMiniMain] = useState(true);
  const [init, setInit] = useState(false);
  const [connected, setConnected] = useState(false);

  const [audio, setAudio] = useState(false);
  const [view, setVideo] = useState(false);
  const [showCtrls, setShowCtrls] = useState(true);
  const moveTracker = useRef(false)//optional - helps desktop move events not trigger the switch
  const timer = useRef();

  const TriggerStore = useContext(TriggerContext);

  // const pc_config = null;
  // configuration object example
  const pc_config = {
    iceServers: [
      // {
      //   urls: 'stun[STUN-IP]:[PORT]',
      //   credential: '[YOUR CREDENTIAL]',
      //   username: '[USERNAME]'
      // },
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  }// pc_config

  // const socket = io(
  //   'https://example.com/meet/socket'
  // );// failed


  //   'https://example.com/meet/socket'

  // const socket = io(
  //   '/webrtcPeer', {
  //   query: { ns: 'webrtcPeer' },
  // },
  // );// worked

  // const socket = io(
  //   '/webrtcPeer',
  //   {
  //     path: '/liftoff/'
  //   }
  // );// worked

  // const socket = io.connect("http://localhost:3002/meet");//works - meet namespace
  // const socket = io.connect("https://example.com/meet");//works - meet namespace
  // [using socket.io with express docs](https://socket.io/docs/#using-with-express-3/4)
  // const socket = io(
  //   {
  //     path: '/meet/socket'
  //   }
  // );

  // const socket = io(
  //   `http://localhost:3002/webrtcPeer`,
  //   {
  //     // path: '/meet/socket',
  //   }
  // );//this works

  // const socket = io(
  //   `https://example.com/webrtcPeer`,
  //   {
  //     path: '/meet/socket.io',
  //   }
  // );//this fails

  // const socket = io(
  //   `167.99.57.20:3002`,
  //   {
  //     path: '/meet',
  //   }
  // );//this fails
  // transports:['websocket']// doesn't work
  // const pc_ref = useRef();
  let pc;
  // get access to the camera

  useEffect(() => {

    // DOCS: step2: create RTCPeerConnection and setup its event handlers
    pc = new RTCPeerConnection(pc_config);
    // NOTE: if there were 3 peers in the call you would need 2 RTCPeerConnection, one per connection
    /** 
     * QUESTION: Where does pc interact with socket?
     * RESOLVED: offerOrAnswer > stringify into text_ref > setRemoteDescription
     */ 

    pc_ref.current = pc;// hack for stale answer btn
    // socket = io(
    //   '/',
    // );// worked
    console.log(`[rocket] useEffect running!`);

    let socket_url = location.origin.includes("localhost") ? `http://localhost:3002/webrtcPeer` : `${location.origin}/webrtcPeer`

    socket = io(
      socket_url,
      // {path: '/webrtc'}
    );// also works

    // socket = io(
    //   '/webrtcPeer', {
    //     path: '/socket.io',
    //     query: { ns: 'webrtcPeer' },
    //     jsonp: false,
    //   }
    // );// worked

    // socket = io('https://example.com/webrtcPeer', {
    //   path: '/socket.io',
    //   query: { ns: 'webrtcPeer' },
    // });// fails, won't recieve server emit

    // socket = io.connect('https://example.com/webrtcPeer', {
    //   path: '/socket.io',
    //   query: { ns: 'webrtcPeer' },
    // });// fails, won't recieve server emit

    // socket.set('log level', 1);// failed

    socket.on('connection-success', (success) => {
      console.log('[success]', success);
    })

    socket.on('offerOrAnswer', (sdp) => {
      if (!init) { setInit(true); }

      if(true) console.log(`[offerOrAnswer] test sdp for type (offer or answer)`,sdp)
      if(true) console.log(`[offerOrAnswer] textRef value`, textRef.current.value);

      textRef.current.value = JSON.stringify(sdp);
      setRemoteDescription();// i put this here the instructor kept hitting the btn
    });// offerOrAnswer

    socket.on('candidate', (candidate) => {
      console.log("receiving candidates...");
      candidates.current = [...candidates.current, candidate];
      // we can set this to auto answer or only on btn approval
      addCandidate();// FUTURE: in one to one calls this should pick up immediately
      // FUTURE: in selective broadcasts this should only set the candidate of the host selected socketID
      // we can separate it by using a json indicator, it will also not add to the candidates array
      // but replace it
    })

    // DOCS: RTCPeerConnection event handlers
    pc.onicecandidate = (e) => {
      if(0 && e.candidate) console.log(JSON.stringify(e.candidate));


      // GOTCHA: [sending multiple candidates](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate)
      // [Why is my Ice Candidate request firing 6 times instead of 1?](https://stackoverflow.com/questions/36073783/why-is-my-ice-candidate-request-firing-6-times-instead-of-1)
      // NOTE: this one says i should be sending them all

      if(e.candidate){
        // GOTCHA: DOCS: trying not to send null candidate - works. no longer sending null candidates
        if(1) console.log(`[onicecandidate] sending candidate`,e.candidate);
        sendToPeer('candidate', e.candidate);
      }else{
        // All ICE candidates have been sent
      }
    }; // onicecandidate

    pc.oniceconnectionstatechange = (e) => {
      console.log(e);
      // DOCS: helps check the connection state of our peer connection
      // possible values are connected, disconnected, failed and closed
    }; // oniceconnecionstatechange

    // pc.onaddstream = (e) => {
    //   remote_stream.current = e.stream;
    //   remoteVideoRef.current.srcObject = remote_stream.current;
    // }; // onaddstream

    pc.ontrack = (e) => {
      // DOCS: this fires when you recieve tracks from the remote peer
      remote_stream.current = e.streams[0];
      remoteVideoRef.current.srcObject = remote_stream.current;
    }; // ontrack
    // GOTCHA: ontrack event returns a streams array - onaddstream event only returned a single stream object

    const constraints = { video: true, audio: { echoCancellation: true } };//
    // const constraints = {video: true, audio: true};
    // this audio: true may be the src for a mute btn, same with video

    // both set to false may be the key to receiving and watching a stream 
    // without sending sending one (in a way - still sending an empty one)

    const success = (stream) => {
      main_stream.current = stream;
      main_stream.current.getVideoTracks()[0].enabled = view;
      main_stream.current.getAudioTracks()[0].enabled = audio;
      videoRef.current.srcObject = main_stream.current;

      if(0){
        // DEPRECATED: will be obsolete in the future
        pc.addStream(stream);
      }else{
        stream.getTracks().forEach(track => {
          pc.addTrack(track, stream);
        });
      }// else
      // [AddStream, AddTrack & AddTranceiver](https://webrtccourse.com/course/webrtc-codelab/module/fiddle-of-the-month/lesson/addstream-addtrack-addtranceiver/)
      
    };// success

    const failure = (e) => {
      console.log('[getUserMedia] error:', e);
    };

    // navigator.getUserMedia( constraints, success, failure);// don't run both - this one is deprecated
    // DOCS: this is the main starting point of viewing the main users video (device webcam).  this isn't actaully webrtc
    // its simply displaying your devices webcam onscreen
    // NOTE: this could be seen as step 1.
    navigator.mediaDevices.getUserMedia(constraints)
      .then(success)
      .catch(failure);

    return () => {
      // unmounting
      clearTimeout(timer.current);// protect against data leak
    }

  }, []);

  let the_small_one = miniMain ? videoRef : remoteVideoRef;
  const [x, y] = useDrag({ mainDrag: the_small_one, mainContain: appContainer, update: miniMain });

  const sendToPeer = (messageType, payload) => {
    socket.emit(messageType, {
      socketID: socket.id,
      payload
    })
  }// sendToPeer

  // (async () => {
  //   const stream  = await navigator.mediaDevices.getUserMedia( constraints);
  //   success(stream)
  // }().catch(failure);

  // DOCS: step2: create offer and answer sdp
  const createOffer = () => {
    console.log('[Offer]');
    setInit(true);
    setConnected(true);
    let pc = pc_ref.current;
    pc.createOffer({ 
      offerToReceiveAudio: 1,// NOTE: this is a step i didn't have - what's its significance? author says its optional
      offerToReceiveVideo: 1,
     })
      .then((sdp) => {
        if(false) console.log('[sdp]',JSON.stringify(sdp));// print sdp to the console
        pc.setLocalDescription(sdp);// set my own sdp

        sendToPeer('offerOrAnswer', sdp);// this will also add sdp to hidden text input
      }, () => { });// never seen this one on a then statement
  };// createOffer

  const setRemoteDescription = () => {
    const desc = JSON.parse(textRef.current.value);// its in a string form in the text input
    // NOTE: textRef gets its value from socket.on('offerOrAnswer'

    pc.setRemoteDescription(new RTCSessionDescription(desc));
  }// setRemoteDescription

  const createAnswer = () => {
    console.log('[Answer]');
    setConnected(true);
    let pc = pc_ref.current;// hack for missing pc - answerBtn delay causes undefined pc
    pc.createAnswer({ offerToReceiveVideo: 1 })
      .then((sdp) => {
        // console.log('[sdp]',JSON.stringify(sdp));
        pc.setLocalDescription(sdp);// set my own sdp
        sendToPeer('offerOrAnswer', sdp);
      }, () => { })
  }// createAnswer

  const addCandidate = () => {
    // const candidate = JSON.parse(textRef.current.value);
    // console.log('[adding candidate]', candidate);
    // pc.addIceCandidate(new RTCIceCandidate(candidate));
    candidates.current.forEach((candidate) => {
      console.log('[adding candidate]', JSON.stringify(candidate));
      pc.addIceCandidate(new RTCIceCandidate(candidate));
    })

    // GOTCHA: Failed to construct 'RTCIceCandidate': sdpMid and sdpMLineIndex are both null.
  };// addCandidate

  // NOTE: fixes desktop click/mouseup issue
  const hold_tracker = (e) => {

    // half a second is good - 1500 is too long
    let hold_time = 500;//1500;//1000 = 1sec
    let use_event = /*(e.type == "press") ? "pressup" :*/ (e.constructor.name == "TouchEvent" /*&& "ontouchend" in target_element*/) ? "touchend" : "mouseup";

    timer.current = setTimeout(function () {
      moveTracker.current = true;
      clearTimeout(timer.current);
    }, hold_time);

    window.addEventListener(use_event, () => { clearTimeout(timer.current); }, { once: true });
  }// hold_tracker

  const toggleStream = () => {
    // DOCS: at one point i was switching the entire main and remote video streams with the main and remote ref elements
    // now i am only detecting the value of miniMain and switching the css  styles of the ref elements
    // if (miniMain){
    //   remoteVideoRef.current.srcObject = remote_stream.current;
    //   videoRef.current.srcObject = main_stream.current;
    // }else{
    //   remoteVideoRef.current.srcObject = remote_stream.current;
    //   videoRef.current.srcObject = main_stream.current;
    // }
    setMiniMain(!miniMain);
  }// toggleStream

  const toggleAudio = () => {
    setAudio(prev => {
      try {
        main_stream.current.getAudioTracks()[0].enabled = !prev;
      } catch (error) {
      }
      return !prev;
    });
  };

  const toggleVideo = () => {
    setVideo(prev => {
      try {
        main_stream.current.getVideoTracks()[0].enabled = !prev;
      } catch (error) {
      }
      return !prev;
    });
  }

  // Styles.offerBtn.display = !init ? 'block' : 'none';
  Styles.offerBtn = { ...Styles.offerBtn, display: !init ? 'block' : 'none' };

  // Styles.answerBtn.display = init && !connected ? 'block' : 'none';
  Styles.answerBtn = { ...Styles.answerBtn, display: init && !connected ? 'block' : 'none' };

  Styles.leaveBtn = {...Styles.leaveBtn, display: init && connected ? 'block' : 'none'};

  Styles.audioMngr.color = audio ? 'green' : 'red';// ISSUE: color is not updating
  Styles.videoMngr.color = view ? 'green' : 'red';

  if (display_console || false) console.warn(`[rocket] x(${x}) y(${y})`);

  // let mobile_width = isMobile ? { width:'40%'} : {};
  Styles.smallScreen = { ...Styles.smallScreen, transform: `translate(${x}px,${y}px)`/*, ...mobile_width*/ };

  let main_class = miniMain ? Styles.smallScreen : Styles.bigScreen;
  let alt_class = miniMain ? Styles.bigScreen : Styles.smallScreen;
  let audioClass = `svg-icon-mic2-${audio ? 'on' : 'off'} svg-icon`;
  let videoClass = `svg-icon-video2-${view ? 'on' : 'off'} svg-icon`;
  // () => {}

  let aAProps = {
    custom: audioClass,
    callback: toggleAudio,
    inner: { ...Styles.audioMngr },
    label: { ...Styles.mediaLabel },
    outer: { ...Styles.mediaOuter },
    text: audio ? "mute" : "unmute",
  };

  let aVProps = {
    custom: videoClass,
    callback: toggleVideo,
    inner: { ...Styles.videoMngr },
    label: { ...Styles.mediaLabel },
    outer: { ...Styles.mediaOuter },
    text: view ? "hide" : "show"
  };

  const in_session = (init && connected) ? true : false;


  // LATER: test when in session - disabled until then
  let visible_class = (showCtrls) ? "visible" : "hidden";
  let menu_options = {name:"trigr_menu", project:"trigger",  }
  menu_options.sign_out = props.sign_out || false;// signout will be conditional
  if (TriggerStore.type == "client" ) menu_options.exit_text = "Home";// null will be default text

  return (
    <BrowserRouter>
      <div ref={appContainer} style={Styles.bg_style}>

        {/* header elements */}
        <div className={`header ${visible_class}`} style={Styles.header}>
          {TriggerStore.client.id == null ?
            // <ProfilePanel {...{ name: "trigr_qrcode", project: "trigger", left: false, icon: "qrcode" }} />
            <QRCoder {...{ name: "trigr_qrcode", project: "trigger", left: false, icon: "qrcode" }} />
            : null}
          <ProfilePanel {...{ name: "trigr_users", project: "trigger", left: true, icon: "users"}} >
            <Contacts />
          </ProfilePanel>
          <ProfilePanel {...menu_options}>
            <Dashboard />
          </ProfilePanel>
        </div>

        <video
          style={main_class}
          ref={videoRef}
          // poster={`${location.href}js/assets/React-icon.png`}// didn't help
          onMouseDown={hold_tracker}
          onClick={(e) => {
            // only hitting the small screen switches the screen
            if (moveTracker.current == true) return moveTracker.current = false;// fixes desktop click/mouseup issue
            e.preventDefault();
            if (miniMain) {
              toggleStream();
            } else {
              setShowCtrls(prev => !prev);
            }
            e.stopPropagation();
          }}
          muted={true}
          autoPlay />
        <video
          style={alt_class}
          poster="./assets/React-icon.png"
          ref={remoteVideoRef}
          autoPlay
          onMouseDown={hold_tracker}
          onClick={(e) => {
            // only hitting the small screen switches the screen
            if (moveTracker.current == true) return moveTracker.current = false;// fixes desktop click/mouseup issue
            e.preventDefault();
            if (!miniMain) {
              toggleStream()
            } else {
              setShowCtrls(prev => !prev);
            }
            // toggle controls for big screen
            e.stopPropagation();
          }}
        />

        {/* footer elements */}
        <div className={`footer ${visible_class}`} style={Styles.footer}>
          <div style={Styles.mediaSection}>
            <MediaBtn {...aAProps} />
            <MediaBtn {...aVProps} />
          </div>
          <button type="button" onClick={createOffer} style={Styles.offerBtn}>Join</button>
          <button type="button" onClick={createAnswer} style={Styles.answerBtn}>Accept</button>
          <button type="button" onClick={() => { }} style={Styles.leaveBtn}>Leave</button>
          <br />
          <input type="hidden" ref={textRef} />
          <br />
          {/* <button onClick={setRemoteDescription}>Set Remote Description</button> */}
          {/* <button onClick={addCandidate}>Add Candidate</button> */}
        </div>

      </div>
    </BrowserRouter>
  );
}

export default App;

// urls: [
//   "stun:stun.l.google.com: 19302",
//   "stun:stun1.l.google.com: 19302",
//   "stun:stun2.l.google.com: 19302",
//   "stun:stun3.l.google.com: 19302",
//   "stun:stun4.l.google.com: 19302"
// ]

// Failed to construct 'RTCIceCandidate': sdpMid and sdpMLineIndex are both null.