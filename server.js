'use strict';

const toDoList = [];

let orderStatus = {};

let order;

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
  let newCustomer = true;
  let validItem = true;
  let validAddress = true;

  order = req.body;

  // check if new customer
  customers.forEach(element => {
    if (element.givenName === order.givenName) {
      newCustomer = false;
    } else if (element.country !== 'Canada' && element.country !== 'canada') {
      validAddress = false;
    } else if (order.order === 'shirt') {
      if (stock[order.order][order.size] <= 0) {
        validItem = false;
      } else {
        stock[order.order][order.size]--;
      }
      console.log(stock[order.order][order.size])
    } else if (order.order === 'socks' || order.order === 'bottle') {
      if (stock[order.order] <= 0) {
        validItem = false;
      } else {
        stock[order.order]--;
      }
      console.log(stock[order.order])  
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

      customers.push(newCustomerObject);
    }
  });

  // data object to send depending on survey data
  if (!newCustomer) {
    orderStatus = {
      status: "error",
      error: "repeat-customer"
    }
    res.send(JSON.stringify(orderStatus))
  } else if (!validAddress) {
    orderStatus = {
      status: "error",
      error: "undeliverable"
    }
    res.send(JSON.stringify(orderStatus))
  } else if (!validItem) {
    orderStatus = {
      status: "error",
      error: "unavailable"
    }
    res.send(JSON.stringify(orderStatus))
  } else {
    orderStatus = {
      status: 'success'
    }
    customers.push(newCustomerObject)
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
