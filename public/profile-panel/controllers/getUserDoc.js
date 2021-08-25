  const chalk = require('chalk');
  // const User = require('../../../src/oauth_server/models/user');
  const User = require('../../../models/user');
  const display_console = false;


  const getUserDoc = async function(req, res)
  {
    try {

      //i need this protected by the new jw_token
      if(display_console || false) console.log("[profile api] / api accessed");
      if(display_console || false) console.log("[req.body]",req.body);

      let user = await User.findOne({ _id: req.user._id}).lean();

      let { _id : id, method } = user;
      let { email } = user.google;

      if(display_console || false) console.log("[user doc]",user);


      // res.send("[profile] userDoc controller api connected");// ok this works, we're connected
      // the picture is actually supposed to come from the preset
      // everything is supposed to come from the preset. i need it to so the same thing details view does
      // oauth_server produces presets
      res.json({
        id,
        method,
        email,
        message:"[profile] userDoc controller api connected"
      });

    } catch (e) {
      res.send(`[profile] an error occured ${e}`);// ok this works, we're connected
    }

  }//end getUserDoc


module.exports = getUserDoc;
