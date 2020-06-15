'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//empty array for the todo list
const items = [];

const { stock, customers } = require('./data/promo.js');

const PORT = process.env.PORT || 8000;

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
  // endpoints workshop #1
  .get('/todos', (req, res) => res.render('./pages/todos', { items: items}))
  .post('/data', (req, res) => {
    const { item } = req.body;
    items.push(item);
    res.redirect('/todos');
  })

  //endpoints workshop #2
  .post('/order', (req, res) => { 
    stock: stock
    customers: customers});

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
