// const express = require('express');
// const router = express.Router;
const router = require('express-promise-router')();
const passport = require('passport');
// const passportConfig = require('../passport');

const { validateBody, schemas } = require('../helpers/routeHelpers');// used to validate email and password
const UsersController = require('../controllers/users');
const passportSignIn = passport.authenticate('local', {session: false });
const passportJWT = passport.authenticate('jwt', {session: false });
// const passportGoogle = passport.authenticate('google', { scope:['profile'], session: false });
const passportGoogleToken = passport.authenticate('googleToken', { session: false });
const passportFacebookToken = passport.authenticate('facebookToken', { session: false });
/**
 * @module OAServer-routers-oauth
 * @category Auth
 * @subcategory server-routers
 * @see [OAClient-actions (linkback)]{@link module:OAClient-actions}
 * @see [passport (linkback)]{@link module:passport}
 * @requires OAServer-controllers-users
 */

  /**
  * @file
  */

/**
 * @callback OAServer-routers-oauth-signin
 * @desc DOCS: this first formats the post data into body.value, 
 * it then authenticates using passport to validate the data, 
 * then passes it to the signin route handler if authentic
 * @type {path}
 * @requires passport
 * @requires OAServer-controllers-users
 * @example router.route('/signin').post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);
 * @see [OAClient-actions (linkback)]{@link module:OAClient-actions}
 * @see [passport (linkback)]{@link module:passport}
 * @requires OAServer-controllers-users
 */
router.route('/signin')
  .post(validateBody(schemas.authSchema), passportSignIn, UsersController.signIn);
//sample path:  const res = await axios.post(`${location.origin}/api/auth/signin`, data);

/**
 * @callback OAServer-routers-oauth-signup
 * @type {path}
 * @requires passport
 * @desc DOCS: this is a little different from signin - i doesn't need passport verification because there
 * isn't supposed to be a current user. if a matching email exists, signup errors out with a message back
 * to the user
 * @requires OAServer-controllers-users
 * @example router.route('/signup').post(validateBody(schemas.authSchema),UsersController.signUp);
 * @see [OAClient-actions (linkback)]{@link module:OAClient-actions}
 * @see [passport (linkback)]{@link module:passport}
 * @requires OAServer-controllers-users
 */
router.route('/signup')
.post(validateBody(schemas.authSchema),UsersController.signUp);
//sample path:  const res = await axios.post(`${location.origin}/api/auth/signup`, data);

router.route('/secret')
.get(passportJWT, UsersController.secret);
// .get((req, res) => {
//   console.log('[logging request] req ',req.headers);
//   console.log("[axios] secret is working");
//   res.send("[axios] secret is working");
// })

/**
 * @callback OAServer-routers-oauth-google
 * @type {path}
 * @requires passport
 * @requires OAServer-controllers-users
 * @example router.route('/oauth/google').post(passportGoogleToken, UsersController.googleOAuth);// same as signIn
 * @see [OAClient-actions (linkback)]{@link module:OAClient-actions}
 * @see [passport (linkback)]{@link module:passport}
 * @requires OAServer-controllers-users
 */
router.route('/oauth/google')
.post(passportGoogleToken, UsersController.googleOAuth);// same as signIn
// .post((req, res) => {
//   console.log("[axios] is working");
//   res.send("axios is working")
// })
// sample path: const res = await axios.post(`${location.origin}/api/auth/oauth/google`, { access_token: data });

/**
 * @callback OAServer-routers-oauth-facebook
 * @type {path}
 * @requires passport
 * @requires OAServer-controllers-users
 * @example router.route('/oauth/facebook').post(passportFacebookToken, UsersController.facebookOAuth);
 * @see [OAClient-actions (linkback)]{@link module:OAClient-actions}
 * @see [passport (linkback)]{@link module:passport}
 * @requires OAServer-controllers-users
 */
router.route('/oauth/facebook')
.post(passportFacebookToken, UsersController.facebookOAuth);// same as signIn
// sample path: const res = await axios.post(`${location.origin}/api/auth/oauth/facebook`, { access_token: data });

module.exports = router;
