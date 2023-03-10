# Rocket Notes


#### QUESTION: Where does pc interact with socket?

```
  socket.on('offerOrAnswer', (sdp) => {
    if (!init) { setInit(true); }

    if(true) console.log(`[offerOrAnswer] test sdp for type (offer or answer)`,sdp)
    if(true) console.log(`[offerOrAnswer] textRef value`, textRef.current.value);

    textRef.current.value = JSON.stringify(sdp);
    setRemoteDescription();// i put this here the instructor kept hitting the btn
  });// offerOrAnswer

```

> RESOLVED: offerOrAnswer > stringify into text_ref > setRemoteDescription