const {removeSomething} = require('./remove_something');

export const prep_text = (text) => {
  // let generic_date = ( new Date() ).getTime();
  let alias_title = removeSomething(text,'%20',' ');// modification for old db migration - makes %20 to ' '
  alias_title = removeSomething(alias_title,' ','-');// changes spaces to dashes
  alias_title = removeSomething(alias_title,'--','-');// changes double dash to single dash
  alias_title = alias_title.replace(/[^a-zA-Z0-9 -]/g, "");// what does this one do? - it looks like it removes anything that isn't in the given characters
  alias_title = removeSomething(alias_title,'-');// remove extra dashes --- (for items that already have dashes)
  alias_title = alias_title.toLowerCase();// makes case insensitive aliases

  return alias_title;
}// prep_text
