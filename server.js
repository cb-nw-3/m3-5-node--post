'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

const data = [];

const { stock, customers } = require('./data/promo');

// ex 1 handlers

const handleHomepage = (req, res) => {
  res.render('homepage', { data: data });
}

const addItem = (req, res) => {

  // pull new item from the request body
  // append to the existing list of items

  let newItem = req.body.newitem;

  if (newItem === "") {
    res.redirect('/todos');
    return;
  }

  data.push(newItem);
  res.redirect('/todos');
}

const deleteItem = (req, res) => {
  let deleteItem = req.params.item;
  let dataIdx = data.indexOf(deleteItem);
  data.splice(dataIdx, 1);
  res.redirect('/todos');
}

// ex 2 handlers

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

  .get('/clear/:item', deleteItem)

  // ex 2 endpoint

  // ok. This is both simpler and more complex than previously expected.
  // We need to grab the data and validate it via req.body. Simple enough.

  // However, the form is expecting JSON, because of course it is.
  // So we need to a) create a JS object containing the data,
  // b) amend with the appropriate statuses
  // c) and then use JSON.stringify to JSON-ify the object

  .post('/order', (req, res) => {
    let orderData = req.body;

    // initialize default orderData.status for DRYness reasons

    orderData.status = "error";

    // newUser check

    let newUser = true;
    let providedUser = orderData.givenName + orderData.surname;
    let providedAddy = orderData.address;

    // this seems inefficient, but I don't actually care right now
    // in the future I'll use a database, which ought to be slightly better

    customers.forEach(customer => {
      let fullName = customer.givenName + customer.surname;
      let fullAddress = customer.address;

      if (providedUser === fullName || providedAddy === fullAddress) {
        newUser = false;
      }

    });

    // we can actually refactor this to be slightly cleaner
    // instead of using booleans, we can just use the status
    // but let's work out the logic first, and then clean up after

    if (newUser === false) {
      orderData.error = "repeat-customer";
      res.send(JSON.stringify(orderData));
    }

    // Canada presence check

    if (orderData.country.toLowerCase() != 'canada') {
      orderData.error = "undeliverable";
      res.send(JSON.stringify(orderData));
    }

    // stock check

    if (orderData.order === 'shirt') {
      if (Number(stock['shirt'][orderData.size]) === 0) {
        console.log('nope');
        orderData.error = "unavailable";
        res.send(JSON.stringify(orderData));
      }
    } else {
      if (Number(stock[orderData.order]) === 0) {
        orderData.error = "unavailable";
        res.send(JSON.stringify(orderData));
      }
    }

    // validate all address fields

    if (orderData.address === '' || orderData.city === '' || orderData.province === '' || orderData.country === '') {
      orderData.error = "missing-data";
      res.send(JSON.stringify(orderData));
    }

    // if nothing else went wrong...

    orderData.status = "success";
    res.send(JSON.stringify(orderData));

  })

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
