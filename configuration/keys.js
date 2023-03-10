const dotenv = require('dotenv');
dotenv.config();// .env has to be in the site root to work

// console.log(`[keys] process.env.DOMAIN_NAME`, process.env.DOMAIN_NAME)

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  oauth: {
    google:{
      clientID:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET
    },
    facebook:{
      clientID:process.env.FACEBOOK_CLIENT_ID,
      clientSecret:process.env.FACEBOOK_CLIENT_SECRET
    },
  },
  mongodb:{
    dbURI: `${process.env.MONGODB_LOCAL_TASK_URI}/${process.env.DATABASE}`,
    liveURI:`${process.env.MONGODB_LIVE_TASK_URI}/${process.env.DATABASE}`,
    db:`${process.env.MONGODB_LOCAL_DB}/${process.env.DATABASE}`,
    liveDB:`${process.env.MONGODB_LIVE_DB}/${process.env.DATABASE}`,
    localhost:`${process.env.MONGODB_LOCALHOST_DB}/${process.env.DATABASE}`
  },
  session:{
    cookieKey:process.env.SESSION_COOKIE_KEY
  },
  youtube:{
    APIKey:process.env.YOUTUBE_API_KEY
  },
  use_local_files: process.env.USE_LOCAL_FILES,
  SITE_SERVER: process.env.SITE_SERVER,
  DOMAIN_NAME: process.env.DOMAIN_NAME,
  HOSTNAME: process.env.DOMAIN_NAME.split(".")[0],
  SERVER_PORT: process.env.SERVER_PORT,
  LOCAL_PORT: process.env.LOCAL_PORT,
}


//https://medium.com/the-node-js-collection/making-your-node-js-work-everywhere-with-environment-variables-2da8cdf6e786
