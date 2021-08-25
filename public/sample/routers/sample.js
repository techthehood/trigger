const express = require('express');
const router = express.Router();
const cors = require('cors');// make sure not just anyone can use my post requests

const corsOptions = require('../utils/cors-options.js');

  // if not external files use these get methods to return
  // request based on what if found in the urls pathname
  router.get('/req/sample', cors(corsOptions), (req, res) => {
    // res.send('Hello express!')
    console.log(`[top sample] running!`);
    res.render('sample', {
      title:'Sample',
      name: 'Andrew Mead'
    })
  });

module.exports = router;
