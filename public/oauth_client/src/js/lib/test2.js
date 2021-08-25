function crazy(txt){
  console.log("testjs running!");
  console.log(`testjs ${txt}`);
  try{console.log(`testjs ${txt} makeContact = `,makeContact);}catch(err){console.log(err);}

  return "code from test.js"
}

const whatever = function(){
  return "some string of whatever";
}
module.exports = whatever;

const something_else = function()
{
  let ext_str = whatever();
  let new_str = `some string of someting else. ${ext_str}`;
  return new_str;
}//something_else

module.exports = {
  whatever,
  something_else
};
