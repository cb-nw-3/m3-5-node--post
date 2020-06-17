'use strict';
// to do list elements
const toDoList = [];
// status object to modify into json and send it
let orderStatus = {};
// order/customer information
let order;
// customer object to push it into array data
let newCustomerObject = {};

const { stock, customers } = require('./data/promo.js');

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

const handleToDoList = (req, res) => {
  res.render('pages/todos', { items: toDoList });
}

const handleDataToDoList = (req, res) => {
  const { task } = req.body;
  toDoList.push(task);
  
  res.redirect('/todos');
}

const handleOrder = (req, res) => {
  // variable to check if customer is new or not
  let newCustomer = true;
  // form data is inserted in this variable
  order = req.body;
  // check if good order
  customers.forEach(element => {
    // new customer
    if (element.givenName === order.givenName) {
      newCustomer = false;
    // shirt order
    } else {
      newCustomerObject =   {
        givenName: order.givenName,
        surname: order.surname,
        email: order.email,
        address: order.address,
        city: order.city,
        province: order.province,
        postcode: order.postcode,
        country: order.country,
      }
    }
  });

  // data object to send depending on survey data
  // if not new customer
  if (!newCustomer) {
    // status change
    orderStatus = {
      status: "error",
      error: "repeat-customer"
    }
    res.send(JSON.stringify(orderStatus))
  // if not in canada
  } else if (req.body.country !== 'Canada' && req.body.country !== 'canada') {
    // status change
    orderStatus = {
      status: "error",
      error: "undeliverable"
    }
    // status send
    res.send(JSON.stringify(orderStatus))
  // if order is a shirt
  } else if (req.body.order === 'shirt') {
    // if item is not in stock
    if (stock[order.order][order.size] <= 0) {
      // status change
      orderStatus = {
        status: "error",
        error: "unavailable"
      }
      // status send
      res.send(JSON.stringify(orderStatus))
    // if item is in stock
    } else {
      stock[order.order][order.size]--;
      // status change
      orderStatus = {
        status: 'success'
      }
      // add customer tocustomerrs array
      customers.push(newCustomerObject)
      // status send
      res.send(JSON.stringify(orderStatus))
    }
  // if item is socks or bottles
  } else if (req.body.order === 'socks' || req.body.order === 'bottles') {
    // if item is not in stock
    if (stock[order.order] <= 0) {
      // status change
      orderStatus = {
        status: "error",
        error: "unavailable"
      }
      // status send
      res.send(JSON.stringify(orderStatus))
    // if item is in stock
    } else {
      stock[order.order]--;
      // status change
      orderStatus = {
        status: 'success'
      }
      // add customer tocustomerrs array
      customers.push(newCustomerObject)
      // status send
      res.send(JSON.stringify(orderStatus))
    }
  // if everything is good
  } else {
    // status change
    orderStatus = {
      status: 'success'
    }
    // add customer tocustomerrs array
    customers.push(newCustomerObject)
    // status send
    res.send(JSON.stringify(orderStatus));
  }
  res.redirect('/order-confirmed')
}

const handleOrderConfirmed = (req, res) => {
  res.render('./pages/order-confirmed/confirmed-order', { order: order })
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
  .get('/todos', handleToDoList)
  .post('/data', handleDataToDoList)

  .get('/order-confirmed', handleOrderConfirmed)
  .post('/order', handleOrder)
  
  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
