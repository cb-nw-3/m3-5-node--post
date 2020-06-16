'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

//empty array for the todo list
const items = [];


const { stock, customers } = require('./data/promo.js');

const PORT = process.env.PORT || 8000;

const handleForm = (req, res) => {
  
  let completedForm = req.body;
  let customerNames = [];
  let customerAddress = [];
  customers.forEach((customer) => customerNames.push(customer.givenName));
  customers.forEach((customer) => customerAddress.push(customer.address));

  customers.forEach((customer) => {
    if (
      customer.givenName === completedForm.givenName &&
      customer.address === completedForm.address
    ) {
      console.log("You have already purchased an item");
      res.send(JSON.stringify({ status: "error", error: "repeat-customer" }));
    }
  });

  if (completedForm.country !== "Canada") {
    console.log("Delivery is within Canada only");
    res.send(JSON.stringify({ status: "error", error: "undeliverable" }));
  }

  //if all values in completedForm does not include "undefined"
  if (!Object.values(completedForm).includes("undefined")) {
    //status: "success" redirects you to /order-confirmed from the script.js
    res.send(JSON.stringify({ status: "success" }));
  } else {
    res.send(JSON.stringify({ status: "error", error: "missing-data" }));
  }
};

//express
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
  .post('/order', handleForm)

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
