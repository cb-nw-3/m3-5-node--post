const items = [];

const handleFormData = (req, res) => {
  const { item } = req.body;
  items.push(item);
  res.redirect("/todos");
};

const handleHomePage = (req, res) => {
  res.render("pages/todos", { items: items });
};

const handle404 = (req, res) => {
  res.status(404);
};

// exercise 2
// require access to promo file for stock and customers
let { stock, customers } = require("./data/promo");

// function validating orders
function orderValidation(req, res) {
  let newCustomer = req.body;
  customers.forEach((customer) => {
    // check for name and address
    if (
      customer.givenName === newCustomer.givenName &&
      customer.surname === newCustomer.surname
    ) {
      res.json({
        status: "error",
        error: "repeat-customer",
      });
    }
    if (
      customer.address === newCustomer.address &&
      customer.city === newCustomer.city
    ) {
      res.json({
        status: "error",
        error: "repeat-customer",
      });
    }
    // check whether country is canada
    if (newCustomer.country != "Canada") {
      res.json({
        status: "error",
        error: "undeliverable",
      });
    }
  });
  // check that customer selected an item
  if (newCustomer.order === "undefined") {
    res.json({
      status: "error",
      error: "missing-data",
    });
  }
  // verify order is available
  if (newCustomer.order === "bottle" || "socks") {
    if (Number(stock[newCustomer.order]) === 0)
      res.json({
        status: "error",
        error: "unavailable",
      });
  }
  if (newCustomer.order === "shirt") {
    if (Number(stock["shirt"][newCustomer.size]) === 0)
      res.json({
        status: "error",
        error: "unavailable",
      });
  }
  // check that a complete address was provided
  if (
    newCustomer.address == null ||
    newCustomer.address == "" ||
    newCustomer.city == null ||
    newCustomer.city == "" ||
    newCustomer.province == null ||
    newCustomer.province == "" ||
    newCustomer.postcode == null ||
    newCustomer.postcode == "" ||
    newCustomer.country == null ||
    newCustomer.country == ""
  ) {
    res.json({
      status: "error",
      error: "missing-data",
    });
  }
}

module.exports = {
  handleFormData,
  handleHomePage,
  handle404,
  orderValidation,
};
