const express = require('express');
const cp = require('cookie-parser');
const chalk = require('chalk');
const router = express.Router();
const cors = require('cors');// make sure not just anyone can use my post requests
const passport = require('passport');
const passportJWT = passport.authenticate('jwt', { session: false /*, failureRedirect: '/home'*/ });
// DOCS: the redirect doesn't help, its better to just throw a 401 error and catch it then do something
// const items = require("./items");
const users = require("./users");
// const arc = require("./arc");

const corsOptions = require('../../../src/utils/cors-options');// use the main one in landing-pages src dir
const cookie_monster = require('../Controllers/cookie_monster');
// const process_memory = require('../utils/process_memory.js');

router.use(cp());

// router.all('/*', cors(corsOptions), cookie_monster);

// origin/api/
router.all('/*', cors(corsOptions), passportJWT, async (req, res, next) => {
  console.log('[trigger] api - cors/passport passed');
  next();
  // next(new Error("Permission denied."));
})

// router.use("/items", items);
// '/api/trigger/items/'

router.use("/users", users);
// router.use("/arc", arc);
//path: user/
// '/api/trigger/users/'

router.post('/', async (req, res) => {
  //i need this protected by the new jw_token
  console.log("[trigger api] / api accessed");
  console.log("[req.body]", req.body);

  let task = req.body.task;
});// push

module.exports = router;

  //app.use('/api/alight', arcAPIRouter)// server side auth
