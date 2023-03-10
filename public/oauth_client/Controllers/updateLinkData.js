const chalk = require('chalk');
const User = require('../../../models/user');

const display_console = false;

const updateLinkData = async function (req, res) {
  try {

    let processed_msg = `[updateLinkData] updateLinkData api accessed`;
    if (display_console || true) console.log(chalk.keyword('aquamarine')(processed_msg));
    // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

    if (display_console || true) console.log(chalk.red("[updateLinkData] body"), req.body);
    // throw "testing stack";

    // let sponsor = await User.findOne({ _id: sponsor_id });

    console.log("[updateLinkData] req.headers", req.headers);
    // console.log(chalk.keyword('pink')("[updateLinkData] req.cookies", req.cookies));

    res.json({
      updateLinkData: true,
      message: processed_msg,
      user: req.user
    });

  } catch (e) {
    let err_msg = "[updateLinkData] an error occured";
    console.error(chalk.red(err_msg), e);
    res.status(500).json({
      message: err_msg,
      error: error
    });
  }
}// updateLinkData

module.exports = updateLinkData;
