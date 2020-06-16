const items = [];

const { stock, customers } = require('./data/promo.js');
// Added for Exercice 2.

const handleHomePage = (req, res) => {
  res.render('pages/todos', { items: items });
};

const handleFormData = (req, res) => {
  const { item } = req.body;
  items.push(item);

  res.redirect('/todos');
};

const handleForm = (req, res) => {
  let data = req.body;
  // console.log(data);
  // console.log(stock);
  // console.log(customers);

  let customerNames = [];
  let customerAddress = [];
  let country = data.country.toLowerCase();
  console.log(country);
  customers.forEach((customer) => customerNames.push(customer.givenName));
  customers.forEach((customer) => customerAddress.push(customer.address));
  // console.log(customerAddress, customerNames);
  /*
  This will add element to an empty array the element from out Database to 
  compare with the new order.
  */

  let success = JSON.stringify({ status: 'success' });

  let errorUnavailable = JSON.stringify({
    status: 'error',
    error: 'item-unavailable',
  });

  let errorRepeat = JSON.stringify({
    status: 'error',
    error: 'repeat-customer',
  });

  let errorUndeliverable = JSON.stringify({
    status: 'error',
    error: 'undeliverable',
  });

  let errorIncomplete = JSON.stringify({
    status: 'error',
    error: 'incomplete-info',
  });

  /*
  Line 33 to 53 or JSON formatted messages to send back to the terminal. 
  */

  customers.forEach((customer) => {
    if (
      customer.givenName === data.givenName ||
      customer.address === data.address
    ) {
      console.log('client already in ordered');
      res.send(errorRepeat);
    }
    return;
  });

  // This compares the order-form to our data to make sure the same customer cannot order twice.

  if (data.order === 'shirt' && data.size === 'medium') {
    console.log('Out of stock');
    res.send(errorUnavailable);
    return;
  }

  // This ensures that we do not sell an item out of stock, from "promo.js"

  if (country !== 'canada') {
    console.log('Wrong Country');
    res.send(errorUndeliverable);
    return;
  }

  // This ensures we do not deliver to a country outside of Canada.

  res.send(success);
  // console.log('Order Confirmed!');
  // If no errors, this will redirect the customer to the confirmed endpoint.

  // console.log(errorUndeliverable);
};

//

const handle404 = (req, res) => {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('pages/fourOhFour', { path: req.originalUrl });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
};

module.exports = {
  handleFormData,
  handleHomePage,
  handleForm,
  handle404,
};
