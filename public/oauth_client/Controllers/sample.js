  const chalk = require('chalk');
  const User = require('../../../models/user');

  const display_console = false;

  const sample = async function(req, res)
  {
    try {

      let processed_msg = `[sample] sample api accessed`;
      if (display_console || true) console.log(chalk.keyword('aquamarine')(processed_msg));
      // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

      if(display_console || true) console.log(chalk.red("[sample] body"), req.body);
      // throw "testing stack";


      console.log("[sample] req.headers", req.headers);
      // console.log(chalk.keyword('pink')("[sample] req.cookies", req.cookies));

      res.json({
        sample: true,
        message: processed_msg,
        user: req.user
      });

    } catch (e) {
      let err_msg = "[sample] an error occured";
      console.error(chalk.red(err_msg),e);
      res.status(500).json({
        message: err_msg,
        error: error
      });
    }
}// sample

module.exports = sample;
