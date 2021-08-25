// const process_memory = require('./utils/process_memory.js');

const process_memory = () => {

  const used = process.memoryUsage();
  for (let key in used) {
    console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
  }//for

}// process_memory

module.exports = process_memory;
