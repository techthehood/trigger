
const chalk = require('chalk');

const cookie_monster = async (req, res, next) => {
  console.log(chalk.keyword('pink')('[trigger] pre passport api - entered'));

  // check for sameSite cookies
  console.log("[sample] req.headers", req.headers);
  console.log(chalk.keyword('pink')("[sample] req.cookies", req.cookies['d3Cookie']));

  // // res.setHeader('set-cookie',['samesite=strict; secure']);
  // res.cookie('d3Cookie','trigger4', {sameSite:'Lax', secure: true});
  // // set a legacy cookie for other browsers
  // res.cookie('d3Cookie-legacy', 'trigger4', { secure: true });
  // // i think the second one overwrites the first one

  let cookieVal = null;

  if (req.cookies['d3Cookie']) {
    // check the new style cookie first
    cookieVal = req.cookies['d3Cookie'];
  } else if (req.cookies['d3Cookie-legacy']) {
    // otherwise fall back to the legacy cookie
    cookieVal = req.cookies['d3Cookie-legacy'];
  }

  if (cookieVal == null) {
    next(new Error("Permission denied."));
  } else {
    next();
  }// else

}

module.exports = cookie_monster;