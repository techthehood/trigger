const chalk = require('chalk');
const User = require('../../../models/user');
const { signGuestToken } = require('../../../configuration/signToken');

const display_console = false;

const getGuestToken = async function (req, res) {
  try {

    let processed_msg = `[getGuestToken] getGuestToken api accessed`;
    if (display_console || true) console.log(chalk.keyword('aquamarine')(processed_msg));
    // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

    if (display_console || true) console.log(chalk.red("[getGuestToken] body"), req.body);
    // throw "testing stack";


    console.log("[getGuestToken] req.headers", req.headers);
    // console.log(chalk.keyword('pink')("[getGuestToken] req.cookies", req.cookies));

    // if user is a client throw an error
    if(req.user.client_id) throw "unauthrorized client";// keeps clients from creating registrations

    // test only matters here - not in the registerClient route which creates the final client use token
    // passport doesn't have to save that token to the sponsor
     let gt = await signGuestToken({sponsor: req.user, register: true, test: true});
    //  t = await signGuestToken(req.user);// error tester

    res.json({
      getGuestToken: true,
      message: processed_msg,
      sponsor: req.user._id,
      token: gt
    });

  } catch (e) {
    let err_msg = "[getGuestToken] an error occured";
    console.error(chalk.red(err_msg), e);
    res.status(500).json({
      message: err_msg,
      error: e
    });
  }
}// getGuestToken

module.exports = getGuestToken;
