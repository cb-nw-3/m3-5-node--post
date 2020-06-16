//Exercise 2
const { stock, customers } = require('./data/promo');

const handleOrder = (req, res) => {
    const form = req.body;
    //missing data in the form
    if (form.order === "undefined") {
        res.send({ status: 'error', error: 'missing-data' })
    }
    //user has already requested
    else if (userValidation(form)) {
        res.send({ status: 'error', error: 'repeat-customer' })
    }
    //User is not in Canada
    else if (form.country.toLowerCase() != "canada") {
        res.send({ status: 'error', error: 'undeliverable' })
    }
    //Item out of stock
    let stockForOrder = form.order === 'shirt'
        ? stock.shirt[form.size]
        : stock[form.order];

    // Object.values(stock); // ['229', '312', {}]
    // Object.values(stock.shirt); // ['12', '0',]


    if (stockForOrder === '0') {
        res.send({ status: 'error', error: 'unavailable' })
    }
    //all conditions are true
    else {
        res.send({ status: 'success' });
        res.redirect('./order-confirmed');
    }
}

function userValidation(form) {
    // [undefined, true]
    // [undefined, undefined]
    return customers.some(function (customer) {
        if (
            customer.givenName.toLowerCase() === form.givenName.toLowerCase() &&
            customer.surname.toLowerCase() === form.surname.toLowerCase() &&
            customer.address.toLowerCase() === form.address.toLowerCase() &&
            customer.province.toLowerCase() === form.province.toLowerCase() &&
            customer.city.toLowerCase() === form.city.toLowerCase() &&
            customer.postcode.toLowerCase() === form.postcode.toLowerCase()
        ) {
            console.log(customer, form)
            return true;

        }
    });
}

module.exports = { handleOrder };