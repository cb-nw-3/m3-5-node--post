'use strict';

const taskList = [];
let completedOrder = {};
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { stock, customers } = require('./data/promo');

//A few of functions for the validations
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

function outOfStock(order){
  console.log(parseInt(stock.shirt.medium));
  let outOfStock = false;
  switch(order.order) {
    case 'socks':
      if(parseInt(stock.socks) === 0){
        outOfStock = true;
      };
      break;
    case 'bottle':
      if(parseInt(stock.bottles) === 0){
        outOfStock = true;
      };
      break;
    case 'shirt':
      //Sizes
      if(order.size === 'small'){
        if(parseInt(stock.shirt.small) === 0){
          outOfStock = true;
        }
      } else if(order.size === 'medium'){
        if(parseInt(stock.shirt.medium) === 0){
          outOfStock = true;
        }
      } else if(order.size === 'large'){
        if(parseInt(stock.shirt.large) === 0){
          outOfStock = true;
        }
      } else if(order.size === 'xlarge'){
        if(parseInt(stock.shirt.xlarge) === 0){
          outOfStock = true;
        }
      }
      break;
  }
  return outOfStock;
}

function emptyField(order){
  let empty = false;
  if (order.order === 'undefined' ||
    (order.order === 'shirt' && order.size === 'undefined')
    ) { empty = true;
  } else if (order.givenName === '' ||
  order.surname === '' ||
  order.address === '' ||
  order.city === '' ||
  order.province === '' ||
  order.postcode === '' ||
  order.country === ''
  ){ empty = true;
  }
  return empty;
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
  } else if (emptyField(order)){ //Missing info?
    orderInfo.status = 'error';
    orderInfo.error = 'missing-data';
  } else if (outOfStock(order)){  
    orderInfo.status = 'error';
    orderInfo.error = 'unavailable';
  } else {
    orderInfo.status = 'success';
  }
  completedOrder = order;
  res.json(orderInfo);
}

const handleOrderConfirmed = (req, res) => {
  res.render('../public/order-confirmed', {order: completedOrder});
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
