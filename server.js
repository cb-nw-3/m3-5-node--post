'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

const { renderTodoListPage, handleTODOFormData } = require('./todo.js');
const { customers, stock } = require('./data/promo.js');


function cleanString (word)
{
  let wordCleaned = word.trim();
  wordCleaned = wordCleaned.charAt(0).toUpperCase() + wordCleaned.slice(1);
  return wordCleaned
}

const handlePostOrder = (req, res, item) =>
{
   console.log(req.body)


  let givenName = cleanString(req.body.givenName);

  let surName = cleanString(req.body.surname);


  let customersInArray = customers.filter( element =>  element.givenName === givenName && element.surname === surName );

  if (customersInArray.length >= 1)
  {
      res.status(200).json({
        "status": "error",
        "error": "repeat-customer"
      });
  }


  let country = cleanString(req.body.country);
  
  if (country != "Canada")
  {
    res.status(200).json({
      "status": "error",
      "error": "undeliverable"
    });

  }

  let order = req.body.order;
  let size = req.body.size;

  if (order === "bottles" && Number(stock.bottles) > 0)
  {
    console.log ("we have bottles");

  }
  

  let itemsLeftInStock = eval(stock.order);

  console.log(itemsLeftInStock);

    console.log ("should render success json object");
    // res.status(200).json({
    //   "status": "success"
    // });



  // console.log(customersInArray);

}

  //res.status(200).json({errorMessages});




 
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
  .get('*', (req, res) => res.send('Dang. 404.'))
  .post('/order',  handlePostOrder)




  
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));


