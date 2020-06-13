'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

const data = [];

const handleHomepage = (req, res) => {
  res.render('homepage', { data: data });
}

const addItem = (req, res) => {

  // pull new item from the request body
  // append to the existing list of items

  let newItem = req.body.newitem;
  data.push(newItem);
  res.redirect('/');
}

express()
  .use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('public'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set('view engine', 'ejs')

  // endpoints

  .get('/todos', handleHomepage)

  .post('/data', addItem)

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
