const express = require('express');
const cp = require('cookie-parser');
const chalk = require('chalk');
const users = express.Router();
const passport = require('passport');
const sample = require('../Controllers/sample');

// const UserController = require('../controllers/users');
// const uploadBookmark = require('../controllers/lib/uploadBookmark');
// const getUserPrefs = require('../controllers/lib/getUserPrefs');
// const updateSections = require('../controllers/lib/updateSections');


const corsOptions = require('../../../src/utils/cors-options');// use the main one in landing-pages src dir
const test_date = require('../Controllers/test_date');
const getGuestToken = require('../Controllers/getGuestToken');
const registerClient = require('../Controllers/registerClient');
const validateToken = require('../Controllers/validateToken');
const searchContacts = require('../Controllers/searchContacts');
const getLinkData = require('../Controllers/getLinkData');
const setLinkData = require('../Controllers/setLinkData');
const deleteLink = require('../Controllers/deleteLink');
const updateLinkData = require('../Controllers/updateLinkData');
const getPreviewData = require('../Controllers/getPreviewData');


// const process_memory = require('../utils/process_memory.js');
users.use(cp());

//path: origin/api/trigger/users/validate_token
// do i need this if the passportJWT is middleware in the api route? 
// A: yes this validate fn is the return validated message
users.get('/validateToken', validateToken);

users.get('/sample', sample);

users.get('/test_date', test_date);

users.get('/getGuestToken', getGuestToken);

users.get('/registerClient', registerClient);

users.post('/searchContacts', searchContacts);

users.post('/getLinkData', getLinkData);

users.post('/setLinkData', setLinkData);

users.post('/deleteLink', deleteLink);

users.post('/updateLinkData', updateLinkData);

users.post('/getPreviewData', getPreviewData);

// users.get('/getUserPrefs', UserController.get_user_prefs);
// users.get('/getUserPrefs', getUserPrefs);

// users.post('/uploadBookmark', uploadBookmark);

// users.post('/updateSections', updateSections);



// '/api/alight/validate_token'

// users.post('/', async (req, res) => {
//   //i need this protected by the new jw_token
//   console.log("[items api] / api accessed");
//   console.log("[req.body]",req.body);
//
//   let task = req.body.task;
// });// push

module.exports = users;

//app.use('/api/alight', arcAPIRouter)// server side auth
