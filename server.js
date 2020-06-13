'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

const data = [];

const { stock, customers } = require('./data/promo');

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

const handleOrderConfirm = (req, res) => {
  res.send('Order confirmed!');
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

  // ex 1 endpoints

  .get('/todos', handleHomepage)

  .post('/data', addItem)

  // ex 2 endpoint

  // ok. This is both simpler and more complex than previously expected.
  // We need to grab the data and validate it via req.body. Simple enough.

  // However, the form is expecting JSON, because of course it is.
  // So we need to a) create a JS object containing the data,
  // b) amend with the appropriate statuses
  // c) and then use JSON.stringify to JSON-ify the object

  .post('/order', (req, res) => {
    let orderData = req.body;

    // setting up a bunch of booleans for future readability in logic checking

    let newUser = false;
    let canadaPresence = false;
    let inStock = false;
    let fullAddress = false;

    // newUser check

    let providedUser = orderData.givenName + orderData.surname;

    // this seems inefficient, but I don't actually care right now
    // in the future I'll use a database, which ought to be slightly better

    customers.forEach(customer => {
      let fullName = customer.givenName + customer.surname;
      if (providedUser != fullName) {
        newUser = true;
      }
    });

    // Canada presence check

    if (orderData.country.toLowerCase() === 'canada') {
      canadaPresence = true;
    }

    // stock check

    if (orderData.order === 'shirt') {
      if (stock['shirt'][orderData.size] != 0) {
        inStock = true;
      }
    } else {
      if (stock[orderData.order] != 0) {
        inStock = true;
      }
    }

    // validate all address fields

    if (orderData.address != '' && orderData.city != '' && orderData.province != '' && orderData.country != '') {
      fullAddress = true;
    }

    // check all things

  })

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
