'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const { handleHomePage, handleFormData, handleForm } = require('./handlers');
// handleHomePage and HandleFormData for Exercice 1
// handleForm for Exercice 2

const PORT = process.env.PORT || 8000;

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
  .get('/todos', handleHomePage)
  .post('/form-data', handleFormData)
  // Added for Exercice 1

  .post('/order', handleForm)
  // Added for Exercice 2

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));

// For this Exercice 2 we need to create a folder "order-confirmed" and file "index.html" within the newly created folder.
// The page will be redirected automaticaly because of line 20 in this file.
