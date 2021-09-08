
// const {removeSomething} = require('./lib/tools/remove_something.js');
const removeSomething = function(targ,char,repl)
{
  /*
  //sample
  ShowData.removeSomething(ShowData.edit.title,' ');//unnessesary spaces
  //control the spaces
  pal = ShowData.removeSomething(pal,' ','-');
  //replace slashes with dashes
  pal = ShowData.removeSomething(pal,'/','-');
  //make sure there are no double dashes
  pal = ShowData.removeSomething(pal,'-');
  */
  //removes multiple spaces leading and trailing
  let curVal = targ;
  //let pattern1 =
  let multi_converter = new RegExp(char + '+','g');//  '/'+ char + '+/g or / +/g
  curVal = curVal.replace(multi_converter,char); //convert all multispaces to space
  if(char == " "){
    let start_converter = new RegExp('^' + char,'g');
    curVal = curVal.replace (start_converter,"");  //remove space from start /^ /g
    let end_converter = new RegExp(char + '$','g');
    curVal = curVal.replace (end_converter,"");  //and end / $/g
  }//if
  if(repl != undefined && repl != ""){
    let replacer = new RegExp(char,'g');
    curVal = curVal.replace(replacer,repl);
  }
  return curVal;
};//end removeSomething

module.exports = removeSomething;