const dotenv = require('dotenv');
const chalk = require('chalk');
const { DOMAIN_NAME } = require('../../configuration/keys');
const display_console = true;

dotenv.config();
// var whitelist = ['http://example1.com', 'http://example2.com'];
var whitelist = [
  `https://${DOMAIN_NAME}`,
  `https://www.${DOMAIN_NAME}`,
  `https://beta.${DOMAIN_NAME}`,
  `https://alt.${DOMAIN_NAME}`,
];

if (process.env.NODE_ENV == "development") {
  whitelist.push('http://localhost');
}

if (display_console || false) console.log(chalk.yellow(`[cors-options] whitelist `), whitelist);

// this works
// var corsOptions = {
//   origin: `https://${DOMAIN_NAME}`,
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// }

//GOTCHA: v8::internal::Heap::PerformGarbageCollection
// learn node perform garbage collection

const corsOptions = {
  methods: "GET,POST",
  origin: function (origin, callback) {
    if (display_console || false) console.log("[cors origin]", origin);//sometimes its undefined
    if (!origin) {
      if (display_console || false) console.log(`[no origin detected]`, origin);
      return callback(null, true);
    }

    if (display_console || false) console.log(`[checking origin] ${origin} against whitelist`);
    if (whitelist.indexOf(origin) !== -1) {
      if (display_console || false) console.log(`[origin permitted]`, origin);
      callback(null, true)
    } else {
      if (display_console || false) console.log(`[origin not permitted]`, origin);
      callback('Not allowed by CORS')
    }//else
  }
}//corsOptions

module.exports = corsOptions;

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
