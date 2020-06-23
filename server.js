'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const items = [];
const { stock, customers } = require('./data/promo');
const PORT = process.env.PORT || 8000;

const handleTodos = (req, res) => {
    res.render('pages/todos', { items: items })
}

const handleData = (req, res) => {
    const { item } = req.body;
    items.push(item);

    res.redirect('/todos');
}

let customerData = {};

const handleSubmitOrderForm = (req, res) => {
    
    customerData = req.body;

    const isARepatCustomer = customers.some((customer) => {
        return customer.givenName === customerData.givenName && customer.surname === customerData.surname
    })

    // 1. return error if user is already in database
    if (isARepatCustomer) {
        res.json({
            status: 'error',
            error: 'repeat-customer'
        });
    }

    // 2. return error if a non-canadian country
    else if (customerData.country.toLowerCase() !== 'canada') {
        res.json({
            status: 'error',
            error: 'undeliverable'
        });
    }

    // 3. return error if shirt size is undefined and qty is 0        
    else if (customerData.size !== undefined && stock.shirt[customerData.size] === '0') {
        res.json({
            status: 'error',
            error: 'unavailable'
        });
    }

    // 4. return error if a field is left empty
    else if (Object.values(req.body).includes('')) {
        res.json({
            status: 'error',
            error: 'missing-data'
        });
    } else {
            res.json({
            status: 'success'
        });
    }
};



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
    .get('/todos', handleTodos)
    .post('/data', handleData)
    .post('/order', handleSubmitOrderForm)
    .get('/order-confirmed', (req, res) => {
        res.render('pages/order-confirmed', { customerData: customerData });
    })

    .get('*', (req, res) => res.send('Dang. 404.'))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
