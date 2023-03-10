  const express = require('express');
  const path = require('path');
  const app = express();
  // const os = require('os');

var http = require('http').Server(app, {cors: {
  origin: ["https://sunzao.us", "https://www.sunzao.us", "https://alt.sunzao.us"]
}});


  const io = require('socket.io')(http);
  // const io = require('socket.io')({path: '/webrtc'});// changes the path from /socket.io to /webrtc
  // [according to this i may be able to add options as a second argument](https://socket.io/docs/v4/server-initialization/)
  // const io = require('socket.io')(http,{path: '/webrtc'});// works

  // console.log(`[rocket] host`, os.hostname());// example
  console.log(`[rocket] dir`, __dirname, __dirname.includes("beta"));
  const SERVER_PORT = __dirname.includes("beta") ? 3004 : 3002;

  const PORT = SERVER_PORT;// see webRTC/rocket


  const { URLSearchParams} = require('url');


  // io.listen(server);

  // to learn more about namespaces
  // https://www.tutorialspoint.com/socket.io/socket.io_namespaces.htm

let connectedPeers = new Map();

const webRTC_Connections = (socket) => {

  
}

// io.set('log level', 1);
const sock = io.sockets.use((socket, next) => {
  // const myURL = new URLSearchParams(socket.handshake.url);
  console.log('[.use] test', 3);
  console.log('[.use] socket namespace', socket.nsp.name);
  // console.log('[.use] socket handshake', socket.handshake);
  // console.log('[.use] socket handshake', socket.handshake.query);// this does nothing new
  const myQry = socket.handshake.query;
  console.log('[.use] ns = ', myQry.ns);

    next();

}).on('connection', (socket) => {
  // NOTE: "connect" && "connection" appear to do the same thing

  const transport = socket.conn.transport.name; // in most cases, "polling"
  console.log(`[connection] transport`, transport);

  socket.conn.on("upgrade", () => {
    const upgradedTransport = socket.conn.transport.name; // in most cases, "websocket"
    console.log(`[connection] upgradedTransport`, upgradedTransport);
  });

  const namespace = socket.handshake.query.ns;
  console.log('[connection] namespace = ', namespace);

  try {
    console.log('[socket] id', socket.id);

    socket.emit('connection-success', { success: socket.id });
    // io.sockets.emit('connection-success', { success: socket.id });// fails

    connectedPeers.set(socket.id, socket);
    // IDEA: i can expand  the peerID data to hold json which includes user id and low-res image blob
    // IDEA: may need mongodb persistence

    socket.on('disconnect', () => {
      console.log('[rocket] disconnected');
      connectedPeers.delete(socket.id);
    });

    socket.on('offerOrAnswer', (data) => {
      // send to the other peer(s) if any
      for (const [peerID, peer] of connectedPeers.entries()) {
        // don't send to self
        if (peerID !== data.socketID) {
          console.log('[offerOrAnswer] id and payload', peerID, data.payload);
          peer.emit('offerOrAnswer', data.payload);// this socket variable is from the for loop
        } else {
          console.log('[same offerAnswer id]');
        }
      }
      // IDEA: groups need to save the offer and the host and auto offer to new connections
      // or auto offer to all existing pending connections
      // there is an issue with late connections net receiving an offer - late connections also need to be approved
      // its easier to kick the one that doesn't belong than to approve all - allow a kick to remove a socket or
      // add a socket to a banned list - how do you keep the ip address from returning? - if registered user
      // we can hold the user id
    });// offerOrAnswer

    socket.on('candidate', (data) => {
      // send to the other peer(s) if any
      for (const [peerID, peer] of connectedPeers.entries()) {
        // don't send to self
        if (peerID !== data.socketID) {
          console.log('[candidate] id and payload', peerID, data.payload);
          peer.emit('candidate', data.payload);
        } else {
          console.log('[same candidate id]');
        }
      }
    });// candidate
  } catch (error) {
    console.log('[socket] an error occured', error);
  }

  

  // IDEA: the host can have a list of socketID's attached to thumbnail images
  //  the host can click the id and inform the server to send the candidate to everyone

  // IDEA: connectedPeers already has the full list of participants
  // parse through the list and match the id to the candidate data - then send the candidate data to each candidate

});


const peers = io.of('/webrtcPeer');
//   // const peers = io.sockets;

//   // keep a reference of all socket connections
peers.on('connection', (socket) => {
  // console.log('running peers io.sockets', socket);
  
  console.log('[socket] peers id', socket.id);

  socket.emit('connection-success', { success: socket.id });

  connectedPeers.set(socket.id, socket);
  // IDEA: i can expand  the peerID data to hold json which includes user id and low-res image blob
  // IDEA: may need mongodb persistence

  socket.on('disconnect', () => {
    console.log('[rocket] disconnected');
    connectedPeers.delete(socket.id);
  });

  socket.on('offerOrAnswer', (data) => {
    // send to the other peer(s) if any
    for (const [peerID, peer] of connectedPeers.entries()) {
      // don't send to self
      if (peerID !== data.socketID) {
        console.log('[offerOrAnswer] id and payload', peerID, data.payload);
        peer.emit('offerOrAnswer', data.payload);// this socket variable is from the for loop
      } else {
        console.log('[same offerAnswer id]');
      }
    }
    // IDEA: groups need to save the offer and the host and auto offer to new connections
    // or auto offer to all existing pending connections
    // there is an issue with late connections net receiving an offer - late connections also need to be approved
    // its easier to kick the one that doesn't belong than to approve all - allow a kick to remove a socket or
    // add a socket to a banned list - how do you keep the ip address from returning? - if registered user
    // we can hold the user id
  });// offerOrAnswer

  socket.on('candidate', (data) => {
    // send to the other peer(s) if any
    for (const [peerID, peer] of connectedPeers.entries()) {
      // don't send to self
      if (peerID !== data.socketID) {
        console.log('[candidate] id and payload', peerID, data.payload);
        peer.emit('candidate', data.payload);
      } else {
        console.log('[same candidate id]');
      }
    }
  });// candidate

  // IDEA: the host can have a list of socketID's attached to thumbnail images
  //  the host can click the id and inform the server to send the candidate to everyone

  // IDEA: connectedPeers already has the full list of participants
  // parse through the list and match the id to the candidate data - then send the candidate data to each candidate

  });// peers connection


  const server = http.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
  })
