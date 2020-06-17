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
    console.log('receiving form');
    let form = req.body;

    const {
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
    } = form;
    
    //if same user
    if (customers.find( customer => customer.givenName === givenName && customer.surname === surname || customer.address === address)) {
            res.json({status: 'error', error:'repeat-customer'});
            console.log('a');
            return;
        }
    
    //if coming from canada
    if (country.toLowerCase() !== 'canada') {
        res.json({status:'error', error:'undeliverable'});
        console.log('b');
        return;
    }

    //if item not in stock
    if (stock[order][size] == 0 || stock[order] == 0 ) {
        res.json({status:'error', error:'unavailable'});
        console.log('c');
        return;
    }
    // if all values are entered
    /*if (customers.find( customer => customer.order != 'shirt' || 'bottles' || 'socks')) {
        
            res.json({status:'error', error:'missing-data'});
            console.log('d');
            return;
        }*/

    res.send(JSON.stringify({status:'success'}));
};

module.exports = {
    validationForm,
}