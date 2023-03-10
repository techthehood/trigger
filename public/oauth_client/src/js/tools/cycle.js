
export const cycle = ({array,value}) => {

  let current_value = value,
  next_value,
  ndx = array.indexOf(current_value);

  if (ndx == array.length - 1 || ndx == -1) {
    next_value = array[0];
  }else{
    next_value = array[ndx + 1];
  }

  return next_value;
}// cycle
