const removeSomething = require('../public/oauth_client/Controllers/remove_something');

/**
 * @desc get_date_value reads a timestamp and returns desired data value
 * @param {string} mode type of value you want processed out of timestamp [datetime, date, time]
 * @param {number} timestamp *required - timestamp date will be extracted from
 * @param {boolean} ext write an extended date
 * @returns 
 */

const get_date_value = (initDate = Date.now()) => {
  let ready_timestamp;
  try {
    ready_timestamp = new Date(initDate).getTime();// set to timestamp
  } catch (error) {
    console.error(`[get_date_value] an error occured`, error);
  }// catch
  return{
    datetime(){
      // return outputs
      return new Date(ready_timestamp).toISOString();
    },
    dateAndTime() {
      // return outputs
      return new Date(ready_timestamp);
    },
    date(ext = false){
      t = new Date(ready_timestamp);
      let m_calc = t.getMonth() + 1;
      let my_month = m_calc < 10 ? `0${m_calc}` : `${m_calc}`;
      let d_calc = t.getDate();// returns day of the month
      let my_day = d_calc < 10 ? `0${d_calc}` : `${d_calc}`;

      return ext ? t.toDateString() : `${t.getFullYear()}-${my_month}-${my_day}`;
    },
    time(){
      t = new Date(ready_timestamp);
      return `${t.getHours()}:${t.getMinutes()}`;
    },
    timestamp(){
      return ready_timestamp;
    },
    add(value) {
      var matches = value.match(/-?\d+/);// /-?\d+/g
      let nbr = Number(matches[0]);// time measurement
      r = new RegExp(/(\d+)/, 'g')// removes numbers from a string
      let value_str = removeSomething(value.replace(r, ""), " ");// unit of time
      let unit = value_str.split(" ")[0];
      let td;// test_date

      console.log(`[nbr]`,nbr);

      switch (unit) {
        case "year":
        case "years":
          td = new Date(ready_timestamp);
          let year = Number(td.getFullYear());
          let month = td.getMonth();
          let day = td.getDate();
          let hours = td.getHours();
          let minutes = td.getMinutes();
          let seconds = td.getSeconds()
          td = new Date(year + nbr, month, day, hours, minutes, seconds);
          ready_timestamp = td.getTime();
          break;
        case "month":
        case "months":
          td = new Date(ready_timestamp);
          let cur_date = td.getDate();
          td.setMonth(td.getMonth() + +nbr);
          if (td.getDate() != cur_date) {
            td.setDate(0);
          }
          ready_timestamp = td.getTime();
          break;
        case "week":
        case "weeks":
          td = new Date(ready_timestamp);
          td.setDate(td.getDate() + nbr * 7);

          ready_timestamp = td.getTime();
          break;
        case "day":
        case "days":
          console.log(`[get_date_value] adding days`);
          td = new Date(ready_timestamp + (nbr * 24 * 60 * 60 * 1000));
          ready_timestamp = td.getTime();
          break;
        case "hour":
        case "hours":
          td = new Date(ready_timestamp + (nbr * 60 * 60 * 1000));
          ready_timestamp = td.getTime();
          break;
        case "minute":
        case "minutes":
          td = new Date(ready_timestamp + (nbr * 60 * 1000));
          ready_timestamp = td.getTime();
          console.log(`[get_date_value] adding minutes`);
          break;
        case "second":
        case "seconds":

          break;
        case "millisecond":
        case "milliseconds":

          break;

        default:
          break;
      }

    }// add
  }// return
}//get_date_value


module.exports = {
  get_date_value
}

// example usage:
// const default_date = useRef(get_date_value({ mode: "date", timestamp: event_date }));
// const default_time = useRef(get_date_value({ mode: "time", timestamp: event_date }));
// const default_datetime = useRef(get_date_value({ mode: "datetime", timestamp: event_date }));

// https://medium.com/onexlab/node-js-javascript-extract-negative-and-positive-numbers-from-the-string-3dfc5f128dcd
// https://www.geeksforgeeks.org/extract-a-number-from-a-string-using-javascript/
// https://stackoverflow.com/questions/42131900/add-5-minutes-to-current-time-javascript/42132083
// https://stackoverflow.com/questions/2706125/javascript-function-to-add-x-months-to-a-date

/**
 * usage:
 * d = get_date_value()
 * d.add("3 minutes");
 * d.date();
 * d.time();
 * d.datetime();
 * d.dateAndTime();
 */