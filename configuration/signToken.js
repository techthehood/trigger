const JWT = require('jsonwebtoken');
const {JWT_SECRET, DOMAIN_NAME} = require('./keys');
const display_console = false;
const mongoose = require('mongoose');
const User = require('../models/user');
const { get_date_value } = require('./get_date_value');

const namespace = `https://${DOMAIN_NAME}/`;// add to env

const signToken = user => {
  let sign_data = {
    iss: `${DOMAIN_NAME}/`,/*can't be a static value*/
    sub: user._id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  }

  let sponsor_claim = `${namespace}sponsor_id`;

  // self sponsored?
  sign_data[`${sponsor_claim}`] = user._id;// initial sponsor is user._id

  return JWT.sign(sign_data, JWT_SECRET);
  
}//signToken
// i could add a sponsor_id by default - but not right now, it already falls back to the user_id without it

const signSponsorToken = ({user_id, sponsor_id}) => {
  let sign_data = {
    iss: `${DOMAIN_NAME}/`,/*can't be a static value*/
    sub: user_id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)// current time + 1 day ahead
  };

  let sponsor_claim = `${namespace}sponsor_id`;

  sign_data[`${sponsor_claim}`] = sponsor_id;

  return JWT.sign(sign_data, JWT_SECRET);
}//signSponsorToken

// verify token will be needed on socket.io servers
const verifyToken = (token, raw = false) => {
  let verifier;
  // if(display_console || false) console.log(`[verifyToken] JWT_SECRET`,JWT_SECRET);
  return undefined;
  let sponsor_claim = `${namespace}sponsor_id`;
  let client_claim = `${namespace}client_id`;
  try {
      verifier = JWT.verify(token, JWT_SECRET);
      if(display_console || false) console.log(`[verifyToken] verifier`,verifier);

    return Promise.resolve()
    .then(async () => {
      
      if (verifier[`${client_claim}`]){
        let client_id = verifier[`${client_claim}`];
        let sponsor_id = verifier[`${sponsor_claim}`]
  
        // all guest tokens will have a client_claim
        // check sponsor for client_id in client array, if no client_id - verifier = undefined;// invalidates token
        let sponsor = await User.findOne({_id: sponsor_id});
        let is_client = sponsor.clients.includes(client_id);
  
        if(!is_client){
          throw 'token is invalid';// return empty handed - invalidates token
        }// if
  
      }// if
      throw 'token is invalid';
    })
    .finally(() => {
      console.log(chalk.green(`[verifyToken] finalizing token`))
      return (raw) ? verifier : (verifier != undefined) ? { user_id: verifier.sub, sponsor_id: verifier[`${sponsor_claim}`] } : verifier;
    }).catch((err) => {
      console.log(chalk.red(`[verifyToken] an error has occured`, err))
      return;
    })


    // what sense does this make?  i guess raw and returning as-is deals with unregistered users?
  } catch (e) {
    // verifier will still be undefined if error
    console.log(chalk.red(`[verifyToken] a try/catch error has occured`, e))
    return;
  }
}// verifyToken

const signGuestToken = ({sponsor, client, register = false, test = false}) => {

  const client_id = client ? client : mongoose.Types.ObjectId();// generate a ObjectId

  let rs = get_date_value();// ready_stamp
  let ts = rs.timestamp();
  rs.add("1 day");
  let exp_date = rs.timestamp();
  
  let sign_data = {
    iss: `${DOMAIN_NAME}/`,/*can't be a static value*/
    sub: sponsor._id,
    iat: ts,//new Date().getTime(),
  }
  
  if(register) sign_data.exp = exp_date;
  // sponsor creates a host code that lives in their client array.
  // once that code is erased, the users token is no longer valid

  let sponsor_claim = `${namespace}sponsor_id`;
  let client_claim = `${namespace}client_id`;// save a client id in the sponsors client array
  let register_claim = `${namespace}register`;
  let test_claim = `${namespace}test`;

  // sponsor can add notes to the id to help them identify the client
  // no, no notes. The sponsor can message them using their id if here is an issue. Also if they are blocked
  // the sponsor gets a record of blocks and negative interactions in an object related to that id

  // self sponsored?
  sign_data[`${sponsor_claim}`] = sponsor._id;// initial sponsor is sponsor._id
  sign_data[`${client_claim}`] = client_id;

  if (register){
    sign_data[`${register_claim}`] = true;
  }// if

  if (test) {
    sign_data[`${test_claim}`] = true;
  }// if

  return JWT.sign(sign_data, JWT_SECRET);

}// signGuestToken

module.exports = {
  signToken,
  signSponsorToken,
  verifyToken,
  signGuestToken,
}
