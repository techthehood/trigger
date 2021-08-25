  const express = require('express');
  const router = express.Router();
  const cors = require('cors');// make sure not just anyone can use my post requests
  const passport = require('passport');
  const passportJWT = passport.authenticate('jwt', {session: false, failureRedirect: '/auth'});
  const display_console = false;


  const getUserDoc = require('../controllers/getUserDoc');
  // const UsersController = require('../controllers/users');
  // const items = require("./items");
  // const users = require("./users");

  const corsOptions = require('../../../src/utils/cors-options');// use the main one in landing-pages src dir
  // const process_memory = require('../utils/process_memory.js');

  // origin/api/
  router.all('/*', cors(corsOptions), passportJWT,  async (req, res, next) => {
    if(display_console || false) console.log('[cors/passport] passed');
    next();
  })

  //path: user/
  // '/api/alight/items/'

  router.post('/', async (req, res) => {
    //i need this protected by the new jw_token
    if(display_console || false) console.log("[profile api] / api accessed");
    if(display_console || false) console.log("[req.body]",req.body);

    let task = req.body.task;


    res.send("[profile] api connected");
  });// push

  router.get('/', async (req, res) => {
    //i need this protected by the new jw_token
    if(display_console || false) console.log("[profile api] / api accessed");
    if(display_console || false) console.log("[req.body]",req.body);

    let task = req.body.task;


    res.send("[profile] api connected");// ok this works, we're connected
  });// push

  router.get('/getUserDoc', getUserDoc);// push

  module.exports = router;

  //app.use('/api/alight', arcAPIRouter)// server side auth
