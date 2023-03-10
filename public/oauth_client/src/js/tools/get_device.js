
export const get_device = function({mode = "size"},xtr)
{
  //pass true to detect xl devices
  //let screen_width = document.body.clientWidth;
  let size_ary = {small:"mobile",medium:"tablet",large:"desktop",xlarge:"max"}

  let screen_width = window.innerWidth;
  let extra = xtr || false;


  //seems off by 16
  let sm = 480;//464;
  let md = 768;//752
  let lg = 992;
  let device_size = (screen_width < sm) ? "small" :
  (screen_width >= sm && screen_width < md) ? "medium" :
  (screen_width >= md && screen_width < lg) ? "large" :
  "xlarge";
  // boss.device_size = (extra === false && device_size == "xlarge") ? "large" : device_size;

  device_size = (extra === false && device_size == "xlarge") ? "large" : device_size;
  let device_type = size_ary[`${device_size}`];

  switch (mode) {
    case "size":
      return device_size;
      break;
    case "type":
      return device_type;
      break;
    case "both":
      return {device_size, device_type};
      break;
  }
}//get_device_size
