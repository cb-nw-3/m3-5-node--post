'use strict';

const toDoList = [];

const { stock, customer } = require('./data/promo');

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

  .post('/order', handleOrder)
  
  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
