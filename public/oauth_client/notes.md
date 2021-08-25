

does node_modules have to be in the root
can multiple node_modules folders be read (detected)?
can node_modules be nested?

### Client side

#### set path to view
```
  const oauthClientPath = path.join(__dirname,"../public/oauth_client/views");// client side auth

```
used with
```
  app.set('view engine', 'hbs');
  app.set('views', [..., oauthClientPath, ...]);//this works
```

#### set partial path
```
  const oauthClientPartialsPath = path.join(__dirname,"../public/oauth_client/views");// client side auth
  hbs.registerPartials(oauthClientPartialsPath);// client side auth
```

#### set the routes public directory
```
  app.use('/auth',express.static(publicDirectoryPath));// client side auth
```

#### set the router
```
  app.use('/auth', require('../public/oauth_client/routers/auth'))// client side auth
```


### Server side

#### server side only needs to set the routers
```
  app.use('/api', require('./oauth_server/routers/oauth'))// server side auth
```

## how do i protect the protected sections with jwt authentication?
> my guess is they're separate entities that can be controlled by the server routers but theres also a way to add jwt authentication to the app.use router path using passport-jwt as middleware


#### Not required
[renderToString hint](https://dev.to/marvelouswololo/how-to-server-side-render-react-hydrate-it-on-the-client-and-combine-client-and-server-routes-1a3p)   
```
  import ReactDOMServer from 'react-dom/server'

  ...
  const component = ReactDOMServer.renderToString(<Hello name={name} />)
```
[Combine the Express router with React Router](https://dev.to/marvelouswololo/how-to-server-side-render-react-hydrate-it-on-the-client-and-combine-client-and-server-routes-1a3p)   
```
  // webpack.config.js
  entry: {
    'home.js': path.resolve(__dirname, 'src/public/home.js'),
    'multipleRoutes.js': path.resolve(__dirname, 'src/public/multipleRoutes.js')
  }
```
**this seems complicated and totally unneccessary - no one else has done all this**

### workflow

  - the app starts at js/index.js
  - app.js wraps all Route components (used by router) and the header
  - the react-router determines the route from the location.pathname and displays the appropriate component as its content
  - pathnames are kept consistent using string properties found in the ./paths directory
  - action names are kept consistent using string properties found in the ./actions/types.js file

#### compose is a  which wraps connect() mapping both state properties and actions object properties to props
SignUp component
here the state.auth.errorMessage is mapped to the props.errorMessage prop.
state.auth state is modified my the auth reducer using action.type AUTH_ERRORS
```
function mapStateToProps(state){
  return {
    errorMessage: state.auth.errorMessage
  }
}
```

```
  export default compose(
  /*connect(null, actions),*/
  connect(mapStateToProps, actions),
  reduxForm({ form: 'signup' })
  )(SignUp)
```

originally for actions to work there is a useDispatch and a dispatch variable
```
  const dispatch = useDispatch();

  dispatch can be used to call and action manually
  dispatch({
    type: actionStringReferencedInReducer,
    payload: some.data.obj
  });

  or an action property which holds and returns an object with the same properties can be created and passed to dispatch

  const some_action = {
    type: actionStringReferencedInReducer,
    payload: some.data.obj
  }

  dispatch(some_action);
```
redux-thunk lets you process data before creating a dispatch object and passing it to a dispatch
also you don't have to useDispatch a dispatch is already passed in from the addition of redux-thunk being passed in
to the provider and its available to the action as a parameter once you add it using the connect closure
```
  export const signOut = () => {
      return dispatch => {
        try {
            localStorage.removeItem('JWT_TOKEN');
            axios.defaults.headers.common['Authorization'] = '';

            dispatch({
              type: AUTH_SIGN_OUT,
              payload: ''
            })

        } catch (err) {
          // console.log("signout error", err);
          dispatch({
            type: AUTH_ERRORS,
            payload: 'there was an issue signing out'
          })
        }// catch
      }
  }
```

the most challenging part of using react-redux is using the wrapping? fns like
```
  export default compose(

    /*connect(null, actions),*/

    connect(mapStateToProps, actions),
    reduxForm({ form: 'signup' })
  )(SignUp)
```

and creating mapStateToProps object
```
  function mapStateToProps(state){
    return {
      errorMessage: state.auth.errorMessage
    }
  }
```
incidentally state is automatically passed in the mapStateToProps fn as a parameter

### Whats the difference between signup and signin?
