const express = require('express');
const router = express.Router();
const cors = require('cors');// make sure not just anyone can use my post requests

const corsOptions = require('../utils/cors-options');
// const process_memory = require('../utils/process_memory.js');

router.get('/req/about', cors(corsOptions), (req, res) => {
  // res.send('Hello express!')
  res.render('about', {
    title:'About Me',
    name: 'Andrew Mead'
  })
})

router.get('/req/help', cors(corsOptions), (req, res) => {
  // res.send('Hello express!')
  res.render('help', {
    title:'Help',
    name: 'Andrew Mead',
    help_txt: 'Some help message'
  })
})

router.get('/help/*', cors(corsOptions), (req, res) => {
  // res.send('my 404 page')
  res.render('404', {
    title:'404',
    errorMessage:'help article not found'
  });
})

router.get('/products', cors(corsOptions), (req, res) => {
  // console.log(req.query);
  // console.log(req.query.search);
  // req.query
  if(!req.query.search){
    // cant send twice so use return
    return res.send({
      error:'You must provide a search term'
    })
  }//if

  res.send({
    products:[]
  })

})//products


module.exports = router;

// const express = require('express');
// const router = express.Router();
//
// module.exports = router;
