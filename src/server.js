const path = require('path');

const express = require('express');
// const proxy = require('http-proxy-middleware');
const hbs = require('hbs');
const chalk = require('chalk');
const cors = require('cors');// make sure not just anyone can use my post requests

// DOCS: passport db modules
var os = require('os');
const mongoose = require('mongoose');
const passport = require('passport');

// DOCS: passport db prep
const passportConfig = require('./oauth_server/passport');// OAUTH 
const Keys = require('../configuration/keys').mongodb;
const { HOSTNAME, DOMAIN_NAME } = require('../configuration/keys');
const corsOptions = require('./utils/cors-options.js');
const process_memory = require('./utils/process_memory.js');

let dbConnect = (os.hostname().includes(HOSTNAME)) ? Keys.liveDB : Keys.db;// what is this in production?
mongoose.connect(dbConnect, { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const PORT = 8080;

//routers
// const webpushRouter = require("./routers/web-push");
// const savepushRouter = require("./routers/save-push");
const pagesRouter = require("./routers/pages");
// const sampleRouter = require("../public/sample/routers/sample");
const oauthClientRouter = require('../public/oauth_client/routers/trigger');
const oauthServerRouter = require('./oauth_server/routers/oauth');

// console.log('forecast = ',forecast);

console.log(`[dirname]`,__dirname);
console.log(`[dirname public path]`,path.join(__dirname,"../public"));

// var nR_Proxy = proxy('/req', {
//   target: `https://${DOMAIN_NAME}/`,
//   changeOrigin: true
// })

const app = express();
//GOTCHA: when i tried to leave the files in templates instead of templates/views it failed

// mongo db setup

const viewsPath = path.join(__dirname,"../templates/views");
// const samplePath = path.join(__dirname,"../public/sample/views");
const oauthClientPath = path.join(__dirname, "../public/oauth_client/views");// client side auth OAUTH DOCS:

//setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', [viewsPath, /*samplePath,*/ oauthClientPath]);//this works

// set up the partials path
const partialsPath = path.join(__dirname,"../templates/partials");
const oauthClientPartialsPath = path.join(__dirname, "../public/oauth_client/views");// client side auth OAUTH DOCS:

hbs.registerPartials(partialsPath);
hbs.registerPartials(oauthClientPartialsPath);


// path to public directory - where to find external files
//setup static directory to serve - server default/root
// this along with the nginx server blocks directs paths to specific 'public' site directories
const publicDirectoryPath = path.join(__dirname,"../public");
app.use('/req',express.static(publicDirectoryPath));
app.use('/', express.static(publicDirectoryPath));// client side auth OAUTH DOCS:


// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(express.json());

// app.use(express.static(publicDirectoryPath));// formerly

// app.use('/req',nR_Proxy);

// setup all routers
app.use(pagesRouter);
// app.use(sampleRouter);
app.use('/', oauthClientRouter);// client side auth OAUTH DOCS:
app.use('/api/auth', oauthServerRouter);// server side auth OAUTH DOCS:

// app.options('/req/post', cors(corsOptions),function(req,res){
//   res.setHeader("Access-Control-Allow-Origin",`https://${req.host}`);
//   // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   res.end();
// });
// app.get('/',(req, res) => {
//   res.redirect('/req/sample');
//   // this works to redirectthe origin to anywhere
// })


//catchall has to be last to work
app.get('*', cors(corsOptions), (req, res) => {
  // res.send('my 404 page')
  console.log('[express server] rendering 404')
  res.render('404', {
    title:'404',
    errorMessage:'page not found'
  });
})

// app.get('/help', (req, res) => {
//   res.send('Help page')
// })
// in this case '/help' and '/help.html' in the public folder are both running


app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}.`);
  process_memory();
})

// process.exit();
