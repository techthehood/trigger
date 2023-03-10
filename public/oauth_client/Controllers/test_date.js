const chalk = require('chalk');
const User = require('../../../models/user');
const { get_date_value } = require('../../../configuration/get_date_value');

const display_console = false;

const test_date = async function (req, res) {
  let value;
  try {

    let processed_msg = `[test_date] test_date api accessed`;
    if (display_console || true) console.log(chalk.keyword('aquamarine')(processed_msg));
    // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

    if (display_console || true) console.log(chalk.red("[test_date] body"), req.body);
    // throw "testing stack";

    console.log("[test_date] req.headers", req.headers);
    // console.log(chalk.keyword('pink')("[test_date] req.cookies", req.cookies));

    // let date_obj = new get_date_value3(req.body.date);
    let date_obj = get_date_value(req.body.date);

    if (req.body.add) {
      let add = (typeof req.body.add == "string") ? [req.body.add] : req.body.add;
      // add.forEach((entry) => {
      //  date_obj.add(entry);
      //  console.log(`[test_date] adding entry`, entry);
      // });
      for (const entry of add) {
        console.log(`[test_date] adding entry`, entry);
        date_obj.add(entry);
      }// for
    }// id

    console.log(`[test_date] adding output`);
    switch (req.body.output) {
      case "date":
          value = date_obj.date();
        break;

      case "time":
          value = date_obj.time();
        break;

      case "datetime":
          value = date_obj.datetime();
        break;

      default:
        break;
    }

    res.json({
      test_date: true,
      message: processed_msg,
      value
    });

  } catch (e) {
    let err_msg = "[test_date] an error occured";
    console.error(chalk.red(err_msg), e);
    res.status(500).json({
      message: err_msg,
      error: e
    });
  }
}// test_date

module.exports = test_date;
