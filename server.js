'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

const { renderTodoListPage, handleTODOFormData } = require('./todo.js');
const { customers, stock } = require('./data/promo.js');


let name;
let product;
let province;

function cleanString(word) {
  let wordCleaned = word.trim();
  wordCleaned = wordCleaned.charAt(0).toUpperCase() + wordCleaned.slice(1);
  return wordCleaned
}

const handlePostOrder = (req, res, item) => {
  console.log(req.body)


  let givenName = cleanString(req.body.givenName);

  let surName = cleanString(req.body.surname);

  let customersInArray = customers.filter(element => element.givenName === givenName && element.surname === surName);

  if (customersInArray.length >= 1) {
    res.status(200).json({
      "status": "error",
      "error": "repeat-customer"
    });
  }


  let country = cleanString(req.body.country);

  if (country != "Canada") {
    res.status(200).json({
      "status": "error",
      "error": "undeliverable"
    });

  }



  // the form prevents empty entries, but let's check to see if we have meaningfulk input

  let undefinedBodyElements = Object.values(req.body).filter(element =>
    element.length <= 1);
  if (undefinedBodyElements.length > 0) {
    // console.log("some fields not filled out");

    // console.log(undefinedBodyElements.length);
    res.status(200).json({
      "status": "error",
      "error": "missing-data"
    });
  }


  let order = req.body.order;
  let size = req.body.size;
  let bottlesRemaining = Number(stock.bottles)
  let smallShirtsRemaining = Number(stock.shirt.small)

  let medShirtsRemaining = Number(stock.shirt.medium)
  let largeShirtsRemaining = Number(stock.shirt.large)
  let xlargeShirtsRemaining = Number(stock.shirt.xlarge)

  let socksRemaining = Number(stock.socks)

  name = givenName + " " + surName;

  if (size != undefined) { product = size + " " + order; }
  else { product = order;}
  province = req.body.province; 
 
 

  if (order === "shirt" && size == "small" && smallShirtsRemaining > 0) {
    console.log("we have small shirts");
    res.status(200).json({
      "status": "success"
    });
  
  }

  if (order === "shirt" && size == "medium" && medShirtsRemaining > 0) {
    console.log("we have medium shirts");
    res.status(200).json({
      "status": "success"
    });
  
  }

  if (order === "shirt" && size == "large" && largeShirtsRemaining > 0) {
    console.log("we have large shirts");
    res.status(200).json({
      "status": "success"
    });
  
  }

  if (order === "shirt" && size == "extralarge" && xlargeShirtsRemaining > 0) {
    console.log("we have xlarge shirts");
    res.status(200).json({
      "status": "success"
    });
  
  }

  if (order === "bottle" && bottlesRemaining > 0) {
    console.log("we have bottles");
    res.status(200).json({
      "status": "success"
    });
  
  }

  if (order === "socks" && socksRemaining > 0) {
    console.log("we have socks");
    res.status(200).json({
      "status": "success"
    });
  
  }

  





  // console.log(customersInArray);

}

//res.status(200).json({errorMessages});

const orderConfirmed = (req, res) => 
{
  console.log("orderconfirmed called");
    res.status(200).render('pages/orderconfirmed', {
      name:name,
    product:product,
  province:province});
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

  .post('/data', handleTODOFormData)
  .get('/', renderTodoListPage)
  .post('/order', handlePostOrder)
  .get('/order-confirmed', orderConfirmed)
  .get('*', (req, res) => res.send('Dang. 404.'))


  .listen(PORT, () => console.log(`Listening on port ${PORT}`));


