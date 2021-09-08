const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const LocalStrategy = require('passport-local').Strategy;
// const GoogleStrategy = require('passport-google-oauth20');
const chalk = require('chalk');
// const GoogleTokenStrategy = require('passport-google-plus-token');
const GoogleTokenStrategy = require('passport-google-token').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const {ExtractJwt} = require('passport-jwt');
const {JWT_SECRET, DOMAIN_NAME} = require('../../configuration/keys');
const Keys = require('../../configuration/keys').oauth;
// const User = require('./models/user');
const User = require('../../models/user');// centralized models

const display_console = true;

// if(display_console || false) console.log("[jwt_secret]",JWT_SECRET);
/**
 * @module passport
 * @category Auth
 * @subcategory server
 * @see [Oauth-routers-oauth]{@link module:Oauth-routers-oauth}
 * @requires OAServer-routers-oauth
 * @desc passport is middleware that is called from and sent back to the same router path
 */

/**
 * @file
 */

// JSON WEB TOKEN STRATEGY
/**
 * @callback JwtStrategy
 * @param {object} payload
 * @param done
 * @desc
 * this strategy processes the token that lives in local storage and is continuously available to the user
 * until the user signs out. With it the user no longer needs to sign in again, their app will always be ready to go.
 * @see [alight/routers/api]{@link module:alight-api}
 */
passport.use( new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: JWT_SECRET
},
  async (payload, done) => {
    try {
      // find the user specified in token
      if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] testing payload`),payload);
      if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] payload sub`),payload.sub);// there is no payload sub
      let namespace = `https://${DOMAIN_NAME}/`;

      const user = await User.findById(payload.sub).lean();

      // if user doesn't exist, handle it
      if(!user){
        return done(null,false);
      }

      let sponsor_claim = `${namespace}sponsor_id`;
      let client_claim = `${namespace}client_id`;
      let register_claim = `${namespace}register`;
      let test_claim = `${namespace}test`;

      if (payload[`${client_claim}`]) {
        let client_id = payload[`${client_claim}`];
        let sponsor_id = payload[`${sponsor_claim}`];
        let test = payload[`${test_claim}`] ? payload[`${test_claim}`] : false;

        // if this token hasn't been registered with the sponsor this section will fail - i need an indicator 
        // on the token that tells me its a registration token, then use this section to register the 
        // user by the new client id

        // if(some claim) register the client on the sponsor otherwise do the sponsor check for client data

        // IDEA: FOR MORE SECURE TOKENS
        // i can also send a message to the sponsor that they registered someone - and to confirm it
        // i can also put a pin in the client obj so the person registering will need it b4 they can use it?
        // i also can track failed attempts and disable the token after x amount of attempts
        if (payload[`${register_claim}`]){
          // return done("token is invalid", false);// test error
          if(!test){
            // save the new client data to the sponsor
          }
        }else{

          // all guest tokens will have a client_claim
          // check sponsor for client_id in client array, if no client_id - verifier = undefined;// invalidates token
          let sponsor = await User.findOne({ _id: sponsor_id });
          let is_client = sponsor.clients.includes(client_id);

          if (!is_client && false) {
            // if (!is_client && false) { // hack for skipping sponsor check
            // throw 'token is invalid';// return empty handed - invalidates token
            return done("token is invalid", false);
          }else{
            user.client_id = payload[`${client_claim}`];
          }// else
        }// else

      }// if

      // check for the existence of a project_id
      // let sponsor_claim = `${namespace}sponsor_id`;
      if(payload[`${sponsor_claim}`]){
        if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] sponsor_claim detected`),payload);
        user.sponsor_id = payload[`${sponsor_claim}`];
      }

      if (payload[`${client_claim}`]) {
        if (display_console || false) console.log(chalk.yellow(`[JwtStrategy] client_claim detected`), payload[`${client_claim}`]);
        user.client_id = payload[`${client_claim}`];
      }

      if (payload[`${test_claim}`]) {
        if (display_console || false) console.log(chalk.yellow(`[JwtStrategy] test_claim detected`), payload[`${test_claim}`]);
        user.test = payload[`${test_claim}`];
      }

      //  otherwise, return the user
      done(null, user);
      // user will now be added to the req.user object

    } catch (error) {
      done(error, false);
    }
}));

// LOCAL STRATEGY
passport.use(new LocalStrategy({
  usernameField: 'email'
}, async (email, password, done) => {
  try {
    // Find the user give the Email
    const user = await User.findOne({ "local.email":email });

    // if not, handle it
    if(!user){
      return done(null, false);
    }

    //  check if password is correct
    const isMatch = await user.isValidPassword(password);

    // if not handle it
    if(!isMatch){
      return done(null, false);
    }

    // otherwise, return user
    done(null, user);
  } catch (error) {
    done(error, false);
  } //catch
}));

/**
 * @callback GoogleTokenStrategy
 * @desc GoogleTokenStrategy middleware
 * @param {string} accessToken
 * @param {string} refreshToken
 * @param {string} profile
 * @param {string} done
 * @see [OAServer-routers-oauth]{@link module:OAServer-routers-oauth}
 * @requires OAServer-routers-oauth
 * @example
 *  passport.use('googleToken', new GoogleTokenStrategy({
 *    clientID: Keys.google.clientID,
 *    clientSecret: Keys.google.clientSecret
 *  }, async (accessToken, refreshToken, profile, done) => {
 *
 *    try {
 *
 *      if(display_console || false) console.log('[google] accessToken',accessToken);
 *      if(display_console || false) console.log('[google] refreshToken',refreshToken);
 *      if(display_console || false) console.log('[google] profile1',profile);
 */

// passport.use('googleToken', new GoogleStrategy({
passport.use('googleToken', new GoogleTokenStrategy({
  clientID: Keys.google.clientID,
  clientSecret: Keys.google.clientSecret
}, async (accessToken, refreshToken, profile, done) => {

  try {

    if(display_console || true) console.log('[google] accessToken',accessToken);
    if(display_console || false) console.log('[google] refreshToken',refreshToken);
    if(display_console || false) console.log('[google] profile1',profile);

    if(display_console || false) console.log(chalk.yellow("[google] profile _json"),profile._json);
    let g_data = {...profile._json};

    // check whegher this current user exists inour DB
    /**
     * @function existingUser
     * @desc calls mongoose request to location user if exists
     * @param {object} google.id sends google profile._json.id to mongodb collection to match with a user ObjectId
     * @example const existingUser = await User.findOne({"google.id":g_data.id}).lean();
     * @returns {object}
     */
    const existingUser = await User.findOne({"google.id":g_data.id}).lean();
    if (existingUser) {
      if(display_console || false) console.log("user already exists in our DB");
      // can i update the existingUser with new data?
      // update the users google data
      await User.findOneAndUpdate({"google.id":g_data.id},{$set:{"google.email":g_data.email, "google.picture": g_data.picture}}).lean();
      return done(null, existingUser);
    }//if

    if(display_console || false) console.log("user doesn't exist we are creating a new one");
    // if new account
    const newUser = new User({
      method: "google",
      google:{
        id: g_data.id,
        email: g_data.email,
        image: g_data.picture
      }
    });

    await newUser.save();
    done(null, newUser);

  } catch (error) {
    if(display_console || false) console.log('[google error]',error);
    done(error, false, error.message);
  }

}))

passport.use('facebookToken', new FacebookTokenStrategy({
  clientID: Keys.facebook.clientID,
  clientSecret: Keys.facebook.clientSecret
}, async (accessToken, refreshToken, profile, done) => {
  try {
    if(display_console || false) console.log('[facebook] profile',profile);
    if(display_console || false) console.log('[facebook] accessToken',accessToken);
    if(display_console || false) console.log('[facebook] refreshToken',refreshToken);

    const existingUser = await User.findOne({"facebook.id":profile.id});

    if(existingUser){
      if(display_console || false) console.log("[facebook] user already exists in our DB");
      return done(null, existingUser);
    }//if

    if(display_console || false) console.log("[facebook] user doesn't exist we are creating a new one");
    // if not
    const newUser = new User({
      method:"facebook",
      facebook:{
        id: profile.id,
        email: profile.emails[0].value
      }
    });

    await newUser.save();

    done(null, newUser);

  } catch (error) {
    done(error, false, error.message);
  }// catch
}))
