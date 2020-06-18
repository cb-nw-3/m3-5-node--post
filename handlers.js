//Exercise 2
const { stock, customers } = require('./data/promo');

const handleOrder = (req, res) => {
    const formData = req.body;
    //missing data in the form
    if (formData.order === "undefined") {
        res.send({ status: 'error', error: 'missing-data' })
    }
    //user has already requested
    else if (userValidation(formData)) {
        res.send({ status: 'error', error: 'repeat-customer' })
    }
    //User is not in Canada
    else if (formData.country.toLowerCase() != "canada") {
        res.send({ status: 'error', error: 'undeliverable' })
    }
    //Item out of stock
    let stockForOrder = formData.order === 'shirt'
        ? stock.shirt[formData.size]
        : stock[formData.order];

    // Object.values(stock); // ['229', '312', {}]
    // Object.values(stock.shirt); // ['12', '0',]


    if (stockForOrder === '0') {
        res.send({ status: 'error', error: 'unavailable' })
    }
    //all conditions are true
    else {
        res.send({ status: 'success' })
    }
}

function userValidation(formData) {
    // [undefined, true]
    // [undefined, undefined]
    return customers.some(function (customer) {
        if (
            customer.givenName.toLowerCase() === formData.givenName.toLowerCase() &&
            customer.surname.toLowerCase() === formData.surname.toLowerCase() &&
            customer.address.toLowerCase() === formData.address.toLowerCase() &&
            customer.province.toLowerCase() === formData.province.toLowerCase() &&
            customer.city.toLowerCase() === formData.city.toLowerCase() &&
            customer.postcode.toLowerCase() === formData.postcode.toLowerCase()
        ) {
            return true;
        }
    });
}

module.exports = { handleOrder };