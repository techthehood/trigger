const { exists } = require("../src/js/tools/exists");

const validateToken = (req, res) => {
  try {
    
    //i need this protected by the new jw_token
    console.log("[trigger api] test_user_data api accessed");
    console.log("[req.body]", req.body);
    console.log("[req.user]", req.user);
  
    let { sponsor_id, client_id } = req.user;
    let default_image =  req.user[req.user.method].image;
    let image = exists(req.user.image) ? req.user.image : default_image;

    let user = { sponsor: { sponsor_id, default_image, image }};// IDEA: what about sponsor username?
    // if(image) user.sponsor.image = image;

    if(req.user.username) user.sponsor.username = req.user.username;

    if (client_id) user.client = {client_id };

    console.log("[req.user] final user", user);
  
    res.json({
      valid: true,
      message: "the token is valid",
      user
    });
  
  } catch (error) {
    res.status(500).json({
      error: true,
      message: `an error occured ${error}`,
    });
  }
}

module.exports = validateToken;