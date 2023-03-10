const chalk = require('chalk');
const User = require('../../../models/user');

const display_console = false;

const deleteLink = async function (req, res) {

  try {

    let processed_msg = `[deleteLink] deleteLink api accessed`;
    if (display_console || true) console.log(chalk.keyword('aquamarine')(processed_msg));
    // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

    if (display_console || true) console.log(chalk.bgCyan("[deleteLink] body"), req.body);
    // throw "testing stack";

    const {sponsor_id, link_id} = req.body;

    let sponsor = await User.findOne({ _id: sponsor_id }, (err, results) => {
      // let links = results.links;// findOneAndUpdate

        let updated_ids = results.links.ids.filter((entry) => {
          return entry != link_id;
        });

      results.links.ids = [...updated_ids];
      
      delete results.links.data[`${link_id}`];

      if (display_console || false) console.log(chalk.bgCyan("[deleteLink] links"), results.links);

      results.markModified("links");

      results.save((err) => {
        if (err) throw "[deleteLink] results failed to save";
        if (display_console || true) console.log(chalk.green("[deleteLink] link saved successfully"));
      });
    });// can lean it at the end?

    let link_data  = sponsor.links;

    if (display_console || false) console.log("[deleteLink] req.headers", req.headers);
    // console.log(chalk.keyword('pink')("[deleteLink] req.cookies", req.cookies));

    res.json({
      message: processed_msg,
      user: req.user,
      link_data
    });

  } catch (e) {
    let err_msg = "[deleteLink] an error occured";
    console.error(chalk.red(err_msg), e);
    res.status(500).json({
      message: err_msg,
      error: error
    });
  }
}// deleteLink

module.exports = deleteLink;
