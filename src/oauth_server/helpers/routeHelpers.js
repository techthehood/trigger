const Joi = require('joi');
const chalk = require('chalk');
const manual_signon = false;

// NOTE: used to validate email and password format

// module.exports = {
//   validateBody: (schema) => {
//     return (req, res, next) => {
//       const result = Joi.validate(req.body, schema);
//       if(result.error){
//         return res.status(400).json(result.error);
//       }//if
//        // req.value.body instead of req.body
//        if(!req.value){req.value = {}; }
//        req.value['body'] = result.value;
//        next();
//     }
//   },
//   schemas:{
//     authSchema: Joi.object().keys({
//       email: Joi.string().email().required(),
//       password: Joi.string().required()
//     })
//   }
// }

const validateBody = (req, res, next) => {
  //updated joi

  // This is a shorter version
  console.log(chalk.yellow(`[routeHelper] req.body`),req.body);

  const { error } = schema.validate(req.body);

  // Error in response

  // res.send(error.details[0].message);
  let error_msg = "[routeHelpers] Joi an error has occured";
  if (error) next(error);// error_msg, false

  let man_msg = "[routeHelpers] manual sign on has been disabled";
  if (!manual_signon) next(man_msg);// use this to disable manual signups and signins
  next();
}

const schema = Joi.object({
  // name: Joi.string().min(3).required(),
  email: Joi.string().min(4).required().email(),
  password: Joi.string().min(6).required()
});

module.exports = { schema, validateBody };