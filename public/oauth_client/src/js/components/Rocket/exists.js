  // const {exists} = require('./lib/tools/exists.js');
const exists = (item, empty_strings_are_ok) => {
  // by default the item does not exist if empty string ("")
  try {
    let the_verdict = (item != null && typeof item != "undefined" && item != false) ? true : false;

    if(empty_strings_are_ok){
      // it has a value, the value is just empty
      return (item == "" || item === 0 || item == false) ? true : the_verdict;
    }else {
      return the_verdict;
    }
  } catch (err) {

    console.log(`[exists] error`,err);
    return false;
  }
}// exists

const obj_exists = (object, properties, empty_strings_are_ok) => {
  // checks object properties
  if (!exists(object, empty_strings_are_ok)) return false;

  let property_array = (properties.includes(".")) ? properties.split(".") : [properties];

  let response;

  try {
    response = property_array.reduce((result, prop, ndx, ary) => {
      result = result[prop];

      // console.log(`[obj_exists] result`, result);

      return result;
    },object);

  } catch (e) {
    return false;
  }

  return exists(response, empty_strings_are_ok);
  // my other setData idea is to use root[property] = value
}// obj_exists

module.exports = {exists, obj_exists}

// NOTES:
// i need to evaluate this "". should this evaluate as true or false by default - right now its true?
// this can't evaluate zero in this case its false
// "" ==  false // true so "" is actually caught in "" - notEmpty is probably doing absolutely nothing

// let x_test1 = exists("");//false
// let x_test2 = exists("words");//true
// let x_test3 = exists("",true);//true
// let x_test4 = exists("words",true);//true

// false booleans return false (they don't exist)

// test_obj = {who:{what:{where:{when:"how"}}}}
