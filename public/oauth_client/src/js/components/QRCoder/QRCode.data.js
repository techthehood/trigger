const { getRegistration } = require("./getRegistration");
 
 /**
  * form data
  */

 export const qr_sponsor_data = {
  register: {
    title: "Register Client",
    btn_title: "Sponsor a new client",// btn title (hover description)
    label: "Registration",// btn label
    description: "New clients can use this link to join the trigger family with you as their sponsor.",
    callback: getRegistration,
    autorun: true,
    // home: true// the first index is home by default
  },
  counselor: {
    title: "Counselor Connect",
    btn_title: "new Counselor Connection",// btn title (hover description)
    label: "Counselor",// btn label
    description: "New clients can instantly navigate to your credentials, to connect to your content or to add you as a counselor.",
    qURL: "https://github.com/zpao/qrcode.react",
  }
}

export const qr_card_data = {
  counselor: {
    title: "Counselor Connect",
    btn_title: "new Counselor Connection",// btn title (hover description)
    label: "Counselor",// btn label
    description: "New clients can instantly navigate to your credentials, to connect to your content or to add you as a counselor.",
    qURL: "https://github.com/zpao/qrcode.react",
    autorun: true,
  }
}