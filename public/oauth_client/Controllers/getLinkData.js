const chalk = require('chalk');
const User = require('../../../models/user');

const display_console = false;

const getLinkData = async function (req, res) {
  try {

    let processed_msg = `[getLinkData] getLinkData api accessed`;
    if (display_console || true) console.log(chalk.keyword('aquamarine')(processed_msg));
    // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

    if (display_console || true) console.log(chalk.red("[getLinkData] body"), req.body);
    // throw "testing stack";

    const {sponsor_id} = req.body;

    let sponsor = await User.findOne({ _id: sponsor_id });

    let link_data  = sponsor.links;

    console.log("[getLinkData] req.headers", req.headers);
    // console.log(chalk.keyword('pink')("[getLinkData] req.cookies", req.cookies));

    res.json({
      getLinkData: true,
      message: processed_msg,
      user: req.user,
      link_data
    });

  } catch (e) {
    let err_msg = "[getLinkData] an error occured";
    console.error(chalk.red(err_msg), e);
    res.status(500).json({
      message: err_msg,
      error: error
    });
  }
}// getLinkData

module.exports = getLinkData;
