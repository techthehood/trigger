// import { obj_exists } from '../../tools/exists';
const { toaster } = require('../Toast/toaster.js');

export const getRegistration = async ({setQURL}) => {
  try {
    const urlMod = "getGuestToken";
    const ctrl_Url = `${location.origin}/api/trigger/users/${urlMod}`;
    const result = await axios.get(ctrl_Url);
    console.log(`[QRC] get registration token`, result);

    let token = result.data.token;

    setQURL(`${location.origin}/client/${token}`);
  } catch (error) {
    console.error(`[QRC][getRegistration] an error occured`, error);
    let qrc_error_msg = "an error occured";
    toaster({ mode: "show", name: "qrc_err", custom: "danger", message: qrc_error_msg, auto: true, sec: 5 });
  }
}// getRegistration