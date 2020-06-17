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
     //Customer has already purchased an item
      res.send(JSON.stringify({ status: "error", error: "repeat-customer" }));
    }
  });

  //tshirt inventory
  if (completedForm.order === "shirt") {
    //let { small, medium, large, xlarge } = stock.shirt;

    //depending on what size, we check if its in stock, if not decrement
    //and send back json response
    switch (completedForm.size) {
      case "small":
        if (stock.shirt.small > 0) {
          stock.shirt.small--;
          break;
        } else {
          res.send(JSON.stringify({ status: "error", error: "unavailable" }));
          break;
        }
      case "medium":
        if (stock.shirt.medium > 0) {
          stock.shirt.medium--;
          break;
        } else {
          res.send(JSON.stringify({ status: "error", error: "unavailable" }));
          break;
        }
      case "large":
        if (stock.shirt.large > 0) {
          stock.shirt.large--;
          break;
        } else {
          res.send(JSON.stringify({ status: "error", error: "unavailable" }));
          break;
        }
      case "xlarge":
        if (stock.shirt.xlarge > 0) {
          stock.shirt.xlarge--;
          break;
        } else {
          res.send(JSON.stringify({ status: "error", error: "unavailable" }));
          break;
        }
    }
   
  }

  //bottles and socks inventory
  switch (completedForm.order) {
    case "bottle":
      if (stock.bottles > 0) {
        completedForm.size = 1;
        stock.bottles--;
        break;
      } else {
        //no more bottles left
        res.send(JSON.stringify({ status: "error", error: "unavailable" }));
        break;
      }
    case "socks":
      if (stock.socks > 0) {
        completedForm.size = 1;
        stock.socks--;
        break;
      } else {
        //no more socks left
        res.send(JSON.stringify({ status: "error", error: "unavailable" }));
        break;
      }
  }

  if (completedForm.country !== "Canada") {
    //Delivery is within Canada only"
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
console.log(stock.shirt.medium);

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
