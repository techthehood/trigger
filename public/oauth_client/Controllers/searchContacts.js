const chalk = require('chalk');
const User = require('../../../models/user');
const { signGuestToken } = require('../../../configuration/signToken');
const mongoose = require('mongoose');
const {exists, obj_exists} = require('../src/js/tools/exists');

const display_console = false;

const searchContacts = async function (req, res) {
  try {

    // let processed_msg = `[searchContacts] searchContacts api accessed`;
    // if (display_console || false) console.log(chalk.keyword('aquamarine')(processed_msg));
    // // [w3schools colors](https://www.w3schools.com/tags/ref_colornames.asp)

    // if (display_console || true) console.log(chalk.keyword('aquamarine')("[searchContacts] body"), req.body);
    // // throw "testing stack";



    // res.json({
    //   searchContacts: true,
    //   message: processed_msg,
    // });

    if (display_console || true) console.log(chalk.green("[searchContacts] body "), req.body);
    if (display_console || true) console.log(chalk.yellow("[searchContacts] user "), req.user);

    let my_data = req.body;
    let { mode = "none", page, limit, active_filters, payload, name, host_id, feed_ids } = my_data;


    let { 
      row_more = true,
      row_start = 0,
      scroll_id = mongoose.Types.ObjectId()
    } = my_data.scroll_data || {};// where is the scroll_data?

    // constroller - distribute by task
    let user_id = req.user._id;

    let return_obj = { scroll_data: {} },
      rows = [],
      row_count = 0,
      remaining_rows = [];


      let start_at = (page - 1) * limit;
      limit = parseInt(limit);
      // page = parseInt(page);

      let start_ndx = parseInt(row_start);
      limit = parseInt(limit);


      if (row_more) {

        // let query = {'_id': { $in: target_ids }, published: true};
        let target_ids = req.user._id;

        let query = {};

        switch (active_filters[0]) {
          case "sponsor":
              query = { '_id': target_ids};
            break;
          case "favorites":
              query = { '_id': { "$in": [target_ids] } };
            break;
          default:
            // there may be an additional check for admin to see other sponsors
              query[`roles`] = active_filters[0];
            break;
        }// switch


        if (display_console || true) console.log(chalk.yellow("[getFeeds] query = ", JSON.stringify(query)));

        // LATER: do i want priority to be a thing with sort?
        // let rows = await Item.find({type: "media", user_id: user_id}).sort({created: -1}).skip(start_at).limit(limit).lean();
        rows = await User.find(query).sort({ created: -1 }).skip(start_ndx).limit(limit).lean();
        if (exists(rows)) row_count = rows.length;

        if (display_console || false) console.log(chalk.yellow("[feed_items]"), rows);

        return_obj.scroll_data.row_more = (!row_more) ? false : (!exists(rows) || rows.length < limit) ? false : true;

        rows = rows.map((row) => {
          let ready_row = {_id: row._id, id: row._id};
          if (typeof row.username != "undefined") ready_row.username = row.username;
          if (typeof row.image != "undefined"){
            ready_row.image = row.image;
          }else{
            if(obj_exists(row,`${row.method}.image`)) ready_row.image = row[row.method].image;
          }// else

          // DOCS: not sending default_image; its auto translated to image

          return ready_row;
        });// map

      }// if 
      // if(display_console || false) console.log(chalk.yellow("[bookmarks_items] typeof"),typeof bookmarks_items, rows);

      let row_rem = remaining_rows.length;
      if (row_rem > 0) return_obj.scroll_data.row_more = true;
      return_obj.scroll_data.row_start = (return_obj.scroll_data.row_more) ? row_start + (row_count - row_rem) : row_start;
      return_obj.scroll_data.mode = (row_start == 0) ? "init" : "update";


      return_obj.data = rows;

      if (display_console || true) console.log(chalk.green(`[getFeeds] scroll_data`), return_obj.scroll_data);

      res.json({
        ...return_obj,
        message: "data updated successfully"
      });

  } catch (e) {
    let err_msg = "[searchContacts] an error occured";
    console.error(chalk.red(err_msg), e);
    res.status(500).json({
      message: err_msg,
      error: e
    });
  }
}// searchContacts

module.exports = searchContacts;
