'use strict';

const { stock, customers } = require('./data/promo.js');
const { checklist } = require('./data/checklist.js');
const nodemon = require('nodemon');
// const { resolveInclude } = require("ejs");
const response = {
  status: 'success',
};

let itemsList = checklist[0].list;

//Handlers Exercise #1
const handleToDos = (req, res) => {
  res.status(200).render('pages/todos', { itemsList });
};

const handleData = (req, res) => {
  const item = { text: req.body.item, checked: false };
  itemsList.push(item);
  res.redirect('/todos');
};

const handleUpdate = (req, res) => {
  itemsList = req.body;
  console.log(itemsList);
  // res.status(200).render("pages/todos", { itemsList });
  res.redirect(301, '/todos');
};

//Handlers Exercise #2

const handleOrder = (req, res) => {
  response.status = 'success';
  delete response.error;
  const form = req.body;
  const formOk = formValidation(form);
  if (formOk) {
    orderValidation(form);
  }
  if (response.status === 'success') {
    const newCustomer = {
      givenName: form.givenName,
      surname: form.surname,
      email: form.email,
      address: form.address,
      city: form.city,
      province: form.province,
      postcode: form.postcode,
      country: form.country,
    };
    customers.push(newCustomer);
    form.size == 'undefined'
      ? (stock[form.order] = (parseInt(stock[form.order]) - 1).toString())
      : (stock.shirt[form.size] = (
          parseInt(stock.shirt[form.size]) - 1
        ).toString());
  }
  res.json(response);
};

function orderValidation(form) {
  let status = true;

  // Validates country as CANADA
  if (form.country.toUpperCase() != 'CANADA') {
    response.status = 'error';
    response.error = 'undeliverable';
  }
  // Validates that the user has not yet placed an order
  firstTimeValidation(form);
  // Validates the address - city - province - post code
  addressValidation(form);
  //Validates the stock
  stockValidation(form);
  // console.log(response);
}

function formValidation(form) {
  console.log(form);
  const status = true;
  if (form.order == 'undefined') {
    response.status = 'error';
    response.error = 'missing-data';
    return false;
  } else {
    for (let key in form) {
      if (form[key] == '') {
        response.status = 'error';
        response.error = 'missing-data';
        return false;
      }
    }
  }
  return status;
}

function stockValidation(form) {
  if (form.size == 'undefined') {
    if (parseInt(stock[form.order]) <= 0) {
      response.status = 'error';
      response.error = 'unavailable';
    }
  } else if (parseInt(stock[form.order][form.size]) <= 0) {
    response.status = 'error';
    response.error = 'unavailable';
  }
}

function firstTimeValidation(form) {
  customers.forEach((customer) => {
    if (
      customer.givenName.toUpperCase() === form.givenName.toUpperCase() &&
      customer.surname.toUpperCase() === form.surname.toUpperCase()
    ) {
      response.status = 'error';
      response.error = 'repeat-customer';
    }
  });
}

function addressValidation(form) {
  customers.forEach((customer) => {
    if (
      customer.address.toUpperCase() === form.address.toUpperCase() &&
      customer.province.toUpperCase() === form.province.toUpperCase() &&
      customer.city.toUpperCase() === form.city.toUpperCase() &&
      customer.postcode.toUpperCase() === form.postcode.toUpperCase()
    ) {
      response.status = 'error';
      response.error = 'repeat-customer';
    }
  });
}

module.exports = {
  handleToDos,
  handleData,
  handleOrder,
  handleUpdate,
};
