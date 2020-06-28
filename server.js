'use strict';

const taskList = [];

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { stock, customers } = require('./data/promo');

//Couple of functions for the validation
function sameName (order){
  let repeat = false;
  const sur = order.surname;
  const giv = order.givenName;
  customers.forEach( cus => {
    if(sur.toLowerCase() === cus.surname.toLowerCase() &&
      giv.toLowerCase() === cus.givenName.toLowerCase()){
      repeat = true;}
  })
  return repeat;
}

function sameStreet(order){
  let repeat =  false;
  const add = order.address;
  customers.forEach( cus => {
    if(add === cus.address){
      repeat = true;
    }
  })
  return repeat;
}

const PORT = process.env.PORT || 8000;

// Handlers
const handleToDoPage = (req,res) => {
  res.render('../todo-pages/todos', {taskList: taskList});
}

const handleTask = (req,res) => {
  const {task} = req.body;
  taskList.push(task);
  res.redirect('/todos');
}

const handleOrderConfirmed = (req, res) => {
  //res.render not working with plain html??? Need to google this...
  res.sendfile('public/order-confirmed.html');
}

const handleOrder = (req, res) => {
  const order = req.body;
  let orderInfo = {};

  if(sameName(order)){ //Repeat customer-name
    orderInfo.status = 'error';
    orderInfo.error = 'repeat-customer';
  } else if (sameStreet(order)){ //Repeat street-name
    orderInfo.status = 'error';
    orderInfo.error = 'repeat-customer';
  } else if (order.country.toLowerCase() !== 'canada'){ //CANADA?
    orderInfo.status = 'error';
    orderInfo.error = 'undeliverable';
  } else {
    orderInfo.status = 'success';
  }
  res.json(orderInfo);
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
  .get('/todos', handleToDoPage)
  .post('/task', handleTask)
  .get('/order-confirmed', handleOrderConfirmed)
  .post('/order', handleOrder)

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
