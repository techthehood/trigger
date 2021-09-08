

const validateToken = (req, res) => {
  //i need this protected by the new jw_token
  console.log("[trigger api] test_user_data api accessed");
  console.log("[req.body]", req.body);

  let { sponsor_id, client_id } = req.user;
  let image = req.user[req.user.method].image;


  res.json({
    valid: true,
    message: "the token is valid",
    user: { sponsor_id, client_id, image }
  });

}

module.exports = validateToken;