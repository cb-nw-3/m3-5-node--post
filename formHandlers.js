const { stock, customers} = require('./data/promo');
let data = {};
let {
    order,
    size,
    givenName,
    surname,
    email,
    address,
    city,
    province,
    postcode,
    country,
} = data;



//validation

const validationForm = (req, res) => {
    let form = req.body
    //if same user
    if (data[givenName] === customers.givenName && data[surname] === customers.surname  ||
        data[address] === customers.address ) {
            res.send({status: 'error', error:'repeat-customer'});
        }
        else {
            res.send({status:'success'});
        }
    
    //if coming from canada
    if (data[country].toLowerCase() !== 'canada') {
        res.send({status:'error', error:'undeliverable'});
    } else {
        res.send({status:'success'});
    }

    //if item not in stock
    if (form === data.order && data.size) {
        res.send({status:'error', error:'unavailable'});
    } else {
        res.send({status: 'success'});
    }

    res.send('success');
};

module.exports = {
    validationForm,
}