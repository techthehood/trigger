const chalk = require('chalk');
const User = require('../../../models/user');

const display_console = false;

const setLinkData = async function (req, res) {
  try {

    let processed_msg = `[setLinkData] setLinkData api accessed`;
    if (display_console || false) console.log(chalk.keyword('aquamarine')(processed_msg));
    // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

    if (display_console || false) console.log(chalk.bgCyan("[setLinkData] body"), req.body);
    // throw "testing stack";

    const {sponsor_id, entry} = req.body;

    let sponsor = await User.findOne({ _id: sponsor_id }, (err, results) => {
      // let links = results.links;// findOneAndUpdate

      if(!results.links.ids.includes(entry.id)){
        results.links.ids = [...results.links.ids,`${entry.id}`];
      }
      
      results.links.data[`${entry.id}`] = {...entry};

      if (display_console || false) console.log(chalk.bgCyan("[setLinkData] links"), results.links);

      results.markModified("links");

      results.save((err) => {
        if (err) throw "[setLinkData] results failed to save";
        if (display_console || true) console.log(chalk.green("[setLinkData] link saved successfully"));
      });
    });// can lean it at the end?

    let link_data  = sponsor.links;

    if (display_console || false) console.log("[setLinkData] req.headers", req.headers);
    // console.log(chalk.keyword('pink')("[setLinkData] req.cookies", req.cookies));

    res.json({
      message: processed_msg,
      user: req.user,
      link_data
    });

  } catch (e) {
    let err_msg = "[setLinkData] an error occured";
    console.error(chalk.red(err_msg), e);
    res.status(500).json({
      message: err_msg,
      error: error
    });
  }
}// setLinkData

module.exports = setLinkData;
