# the OAuth process in a nutshell

### i actually had 2 different oauth tutorials, one ended in trying to use server sessions which i didn't want the other used jwt tokens.

#### [OAuth Login (Passport.js) Tutorial #1 - What is OAuth? (server session tutorial)](https://youtu.be/sakQbeRjgwg)   
**the one i didn't use**
> lesson found in nodejs/auth-test


#### [API Authentication with Node Part #1 - Introduction (JWT tutorial)](https://youtu.be/zx6jnaLuB9Q)   
**the one i used**
> lesson found in nodejs/passport-jwt-course

src/index.js
```
  // path to passport file - connects passport strategies
  const passportConfig = require('./oauth_server/passport');

  // public directory paths
  const oauthClientPath = path.join(__dirname,"../public/oauth_client/views");// client side auth
  const oauthClientPartialsPath = path.join(__dirname,"../public/oauth_client/views");// client side auth
  hbs.registerPartials(oauthClientPartialsPath);// client side auth
  app.use('/auth',express.static(publicDirectoryPath));// client side auth

  // routers
  app.use('/auth', require('../public/oauth_client/routers/auth'))// client side auth
  app.use('/api/auth', require('./oauth_server/routers/oauth'))// server side auth
```

public/oauth_client/src/js/components/SignIn.js
```
  async onSubmit(formData){
    ...
    await this.props.signUp(formData)
    ...
  }

  async responseGoogle(res){
    ...
    await this.props.oauthGoogle(res.accessToken);
    ...
  }


  async responseFacebook(res){
    ...
    await this.props.oauthFacebook(res.accessToken);
    ...
  }

  // form onSubmit callback to handler
  <form onSubmit={handleSubmit(this.onSubmit)}>

  // sample google btn with onSuccess/onFailure callbacks to the class method/handlers
  <GoogleLogin
   clientId="1033836948812-fbkvifqukbtlg2kvorn88jokcpcrdf7k.apps.googleusercontent.com"
   buttonText="Google"
   onSuccess={this.responseGoogle}
   onFailure={this.responseGoogle}
   className="btn btn-outline-danger"
  />
```
**call is made to 3 methods that call an action**

public/oauth_client/src/js/actions/index.js
```
  // signIn takes actions and runs a request with the data before dipatching to reducer
  export const signIn = (data) => {
    return async (dispatch) => {
        const res = await axios.post(`${location.origin}/api/auth/signin`, data);

        dispatch({
          type: AUTH_SIGN_IN,
          payload: res.data.token
        });
    ...
  }

  // the others do the same
  export const oauthGoogle = data => {
    return async dispatch => {

        const res = await axios.post(`${location.origin}/api/auth/oauth/google`, { access_token: data });

        dispatch({
          type: AUTH_SIGN_UP,
          payload: res.data.token
        });
    ...
  }

```
src/oauth_server/routers/oauth.js
```
  const UsersController = require('../controllers/users');

  const { validateBody, schemas } = require('../helpers/routeHelpers');

  const passportSignIn = passport.authenticate('local', {session: false });
  const passportJWT = passport.authenticate('jwt', {session: false });
  const passportGoogleToken = passport.authenticate('googleToken', { session: false });
  const passportFacebookToken = passport.authenticate('facebookToken', { session: false });


  //sample path:  const res = await axios.post(`${location.origin}/api/auth/signup`, data);

  // connects to:
  router.route('/signup')
  .post(validateBody(schemas.authSchema),UsersController.signUp);

  // sample path: const res = await axios.post(`${location.origin}/api/auth/oauth/google`, { access_token: data });

  //connects to:
  router.route('/oauth/google')
  .post(passportGoogleToken, UsersController.googleOAuth);// same as signIn

```
**/signup validateBody(schemas.authSchema) is the middleware that runs before going to UsersController.signUp**
**/oauth/google passportGoogleToken is the middleware that runs before going to UsersController.googleOAuth**


../helpers/routeHelpers.js
```
  const Joi = require('joi');

  module.exports = {
    validateBody: (schema) => {
      return (req, res, next) => {
        const result = Joi.validate(req.body, schema);
        if(result.error){
          return res.status(400).json(result.error);
        }//if
         // req.value.body instead of req.body
         if(!req.value){req.value = {}; }
         req.value['body'] = result.value;
         next();
      }
    },
    schemas:{
      authSchema: Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
      })
    }
  }
```

src/oauth_server/passport.js
```
  passport.use( new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
  },
    async (payload, done) => {
      try {
        // find the user specified in token
        const user = await User.findById(payload.sub);

        // if user doesn't exist, handle it
        if(!user){
          return done(null,false);
        }

        //  otherwise, return the user
        done(null, user);
        // user will now be added to the req.user object

      } catch (error) {
        done(error, false);
      }
  }));
```
**the passport strategies generally just find whether or not the user exists or needs a new user and passes it along**


src/oauth_server/controllers/users.js
```
  const JWT = require('jsonwebtoken');
  const {JWT_SECRET} = require('../configuration/keys')

  const signToken = user => {
    return JWT.sign({
      iss: 'InspectaTech',
      sub: user.id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
    }, JWT_SECRET);
  }//signToken



  signIn: async (req, res, next) => {
    // console.log('UsersController.signIn() called!');
    console.log('successful login');
    console.log('[signIn] req.user',req.user);
    // generate token
    const token = signToken(req.user);
    res.status(200).json({token});

  },
  googleOAuth: async (req, res, next) => {
    // Generate token
    // same as above
    console.log('[googleOAuth] req.user',req.user);
    const token = signToken(req.user);
    res.status(200).json({token});
  },
```
**the users controllers send back a useful and valid sign in token**
> i would add any other new user processes that need to be done to this section
