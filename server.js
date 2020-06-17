'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

const { renderTodoListPage, handleTODOFormData } = require('./todo.js');


 
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
  .get('/order',  (req, res) => res.send('Hello.'))

  
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));



