const JWT = require('jsonwebtoken');
const {JWT_SECRET, DOMAIN_NAME} = require('./keys');
const display_console = false;

const namespace = `https://${DOMAIN_NAME}/`;// add to env

const signToken = user => {
  let sign_data = {
    iss: `${DOMAIN_NAME}/`,/*can't be a static value*/
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  }

  let project_claim = `${namespace}project_id`;

  sign_data[`${project_claim}`] = user._id;// initial project is user._id

  return JWT.sign(sign_data, JWT_SECRET);
}//signToken
// i could add a project_id by default - but not right now, it already falls back to the user_id without it

const signProjectToken = ({user_id, project_id}) => {
  let sign_data = {
    iss: `${DOMAIN_NAME}/`,/*can't be a static value*/
    sub: user_id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  };

  let project_claim = `${namespace}project_id`;

  sign_data[`${project_claim}`] = project_id;

  return JWT.sign(sign_data, JWT_SECRET);
}//signToken

const verifyToken = (token, raw = false) => {
  let verifier;
  // if(display_console || false) console.log(`[verifyToken] JWT_SECRET`,JWT_SECRET);
  let project_claim = `${namespace}project_id`;
  try {
    verifier = JWT.verify(token, JWT_SECRET);
    if(display_console || false) console.log(`[verifyToken] verifier`,verifier);
  } catch (e) {
    // verifier will still be undefined if error
    console.error(e);
  }

  // what sense does this make?  i guess raw and returning as-is deals with unregistered users?
  return (raw) ? verifier : (verifier != undefined) ? { user_id: verifier.sub, project_id: verifier[`${project_claim}`] } : verifier;
}

module.exports = {
  signToken,
  signProjectToken,
  verifyToken
}
