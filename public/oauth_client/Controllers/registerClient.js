const chalk = require('chalk');
const User = require('../../../models/user');
const { signGuestToken } = require('../../../configuration/signToken');

const display_console = false;

const registerClient = async function (req, res) {
  try {

    let processed_msg = `[registerClient] registerClient api accessed`;
    if (display_console || true) console.log(chalk.keyword('aquamarine')(processed_msg));
    // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

    if (display_console || true) console.log(chalk.red("[registerClient] body"), req.body);
    // throw "testing stack";

    // this final token doesn't need register or test
    let gt = await signGuestToken({sponsor: req.user, client: req.user.client_id});// , register: true
    console.log("[registerClient] req.headers", req.headers);
    // console.log(chalk.keyword('pink')("[registerClient] req.cookies", req.cookies));

    res.json({
      registerClient: true,
      message: processed_msg,
      sponsor: req.user.sponsor_id,
      client: req.user.client_id,
      test: req.user.test,
      token: gt
    });

  } catch (e) {
    let err_msg = "[registerClient] an error occured";
    console.error(chalk.red(err_msg), e);
    res.json({
      message: err_msg,
      error: e
    });
  }
}// registerClient

module.exports = registerClient;
