// const User = require('../models/user');
const chalk = require('chalk');
const User = require('../../../models/user');// centralized models
const JWT = require('jsonwebtoken');
const {JWT_SECRET, DOMAIN_NAME} = require('../../../configuration/keys')
const {signToken} = require('../../../configuration/signToken');
// const { initiate_starter_data } = require('./setup');
const display_console = true;

// const signToken = user => {
//   return JWT.sign({
//     iss: `${DOMAIN_NAME}`,/*can't be a static value*/
//     sub: user._id,
//     iat: new Date().getTime(),
//     exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
//   }, JWT_SECRET);
// }//signToken

/**
 * @module OAServer-controllers-users
 * @category Auth
 * @subcategory server-controllers
 * @desc ?
 * @see [OAServer-routers-oauth (router)]{@link module:OAServer-routers-oauth}
 * @requires OAClient-actions
 */

/**
 * @file
 */

module.exports = {
  /**
  * @callback signUp
  * @param {Object} req
  * @param {object} res
  */
  signUp: async (req, res, next) => {
    // expects Email & Password
    // req.value.body
    // if(display_console || false) console.log("content of req.value.body",req.value.body);
    if(display_console || false) console.log('UsersController.signUp() called!');
    // const email = req.value.body.email;
    // const password = req.value.body.password;
    const {email, password } = req.value.body;//see helpers/routeHelpers for src of on req.value.body

    //  Check if there is a user with the same email
    const foundUser = await User.findOne({"local.email":email});
    if(foundUser){
        return res.status(403).json({error:'Email is already in use'});
    }

    //NOW: signUp is going to need to create default data - maybe signIn too (fix missing data)
    // create a new user


    const newUser = new User({
      method: "local",
      local:{
        email,
        password
      }
    });
    await newUser.save();

    // initiate_starter_data({user:newUser});

    // res.json({user:'created'});
    const token = await signToken(newUser);
    // respond with token
    res.status(200).json({token})

  },
  /**
   * @callback signIn
   * @param {Object} req
   * @param {object} res
   */
  signIn: async (req, res, next) => {
    // if(display_console || false) console.log('UsersController.signIn() called!');
    if(display_console || false) console.log('successful login');
    if(display_console || false) console.log('[signIn] req.user',req.user);

    // initiate_starter_data({user:req.user});

    // generate token
    const token = await signToken(req.user);
    res.status(200).json({token});

  },
  /**
   * @callback googleOAuth
   * @param {Object} req
   * @param {object} res
   * @see [OAServer-routers-oauth (router)]{@link module:OAServer-routers-oauth}
   * @example
   * initiate_starter_data({user:req.user});
   * const token = await signToken(req.user);
   * @requires OAClient-actions
   */
  googleOAuth: async (req, res, next) => {
    // Generate token
    // same as above
    if(display_console || true) console.log(chalk.cyan('[controllers/users] googleOAuth req.user'),req.user);// existing user from passport

    // actually needs initiating in the strategy near the new user.save() fn right before done();
    // or do i need this to run every time? - i shouldn't if i make the admin items un-deleteable
    // i can add a restore defaults to the settings and give user ctrl to run it.
    /**
     * @callback initiate_starter_data
     * @param {object} user req.user object
     * @requires OAServer-controllers-setup
     */
    // await initiate_starter_data({user:req.user});// this needs to happen everywhere

    const token = await signToken(req.user);

    res.status(200).json({token});
  },
  /**
   * @callback facebookOAuth
   * @param {Object} req
   * @param {object} res
   */
  facebookOAuth: async (req, res, next) => {
    // Generate token
    // same as above
    if(display_console || false) console.log("[facebookOAuth] Got here!")
    if(display_console || false) console.log('req.user',req.user);

    // initiate_starter_data({user:req.user});

    const token = signToken(req.user);

    res.status(200).json({token});
  },
  secret: async (req, res, next) => {
    // if(display_console || false) console.log('UsersController.secret() called!');
    if(display_console || false) console.log('I managed to get here');
    res.json({secret: 'resource'})

  }
}
