
export const randomizer = (max,min = 0) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}// randomizer

export const getIUN = (val = 10000) => {
  return  Math.round(Math.random() * val)
}
