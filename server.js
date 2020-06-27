'use strict';

const taskList = [];

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const PORT = process.env.PORT || 8000;

// Handlers
const handleToDoPage = (req,res) => {
  res.render('../todo-pages/todos')
}

const handleTask = (req,res) => {
  const {task} = req.body;
  taskList.push(task);
  console.log(taskList);
  res.redirect('/todos');
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

  .get('*', (req, res) => res.send('Dang. 404.'))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
