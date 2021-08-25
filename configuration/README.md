# JWT strategy

#### creating the initial token
oauth_server/controllers/users.js
```
  const token = await signToken(req.user);
```

#### creating the updated session/project_id token
alight/controllers/lib/getProjectToken
```
  if(project) has_access = check_access({user_id, project});
  let token = await signProjectToken({user_id,project_id});
```

#### extracting the user_id (& project_id if available)
passport.js
```
  passport.use( new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: JWT_SECRET
  },
    async (payload, done) => {
      try {
        // find the user specified in token
        if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] testing payload`),payload);
        if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] payload sub`),payload.sub);// there is no payload sub

        const user = await User.findById(payload.sub).lean();

        // if user doesn't exist, handle it
        if(!user){
          return done(null,false);
        }

        // check for the existence of a project_id
        let namespace = "https://example.com/";
        let project_claim = `${namespace}project_id`;
        if(payload[`${project_claim}`]){
          if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] project_claim detected`),payload);
          user.project_id = payload[`${project_claim}`];
        }

        //  otherwise, return the user
        done(null, user);
        // user will now be added to the req.user object

      } catch (error) {
        done(error, false);
      }
  }));
```
> passport.js has a section that checks for the "project_claim". it uses this to extract the project_id from the token;
```
  if(payload[`${project_claim}`]){
    if(display_console || false) console.log(chalk.yellow(`[JwtStrategy] project_claim detected`),payload);
    user.project_id = payload[`${project_claim}`];
  }
```

#### can i check the token directly without using a bearer token in the header?
configuration/signToken.js
```
  verifier = JWT.verify(token, JWT_SECRET);
```

#### My manual verify sample
signToken.js
```
  const verifyToken = (token, raw = false) => {
    let verifier;
    let project_claim = `${namespace}project_id`;
    try {
      verifier = JWT.verify(token, JWT_SECRET);
      if(display_console || false) console.log(`[verifyToken] verifier`,verifier);
    } catch (e) {
      // verifier will still be undefined if error
      console.error(e);
    }

    return (raw) ? verifier : (verifier != undefined) ? { user_id: verifier.sub, project_id: verifier[`${project_claim}`] } : verifier;
  }
```
