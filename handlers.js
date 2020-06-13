const itemsList = [];
const { stock, customers } = require("./data/promo.js")

const handleToDos = (req, res) => {
  res.status(200).render("pages/todos", { itemsList });
};

const handleData = (req, res) => {
  itemsList.push(item);
  res.redirect("/todos");
};


const handleOrder = (req, res) => {
  const form = req.body;
  const validForm = formValidation(form)
  const validOrder = orderValidation(form);
  console.log(validOrder);
  res.redirect("/todos");
};


function orderValidation(form) {
  status = true;

  // Validates country as CANADA
  if (form.country.toUpperCase() != "CANADA"){
    status = false;
  }
  // Validates that the user has not yet placed an order 
  customers.forEach(customer => {
    if (customer.givenName.toUpperCase() === form.givenName.toUpperCase() && customer.surname.toUpperCase() === form.surname.toUpperCase()) {
      status = false;
    }
    // Validates the address - city - province - post code
    if (customer.address.toUpperCase() === form.address.toUpperCase() && customer.province.toUpperCase() === form.province.toUpperCase() && customer.city.toUpperCase() === form.city.toUpperCase() && customer.postcode.toUpperCase() === form.postcode.toUpperCase()) {
      status = false;
    }
  })
  //Validates stock
  status = form.size === "undefined" ? stock[form.order] > 0 : stock[form.order][form.size] > 0;

  return status;
}

function formValidation(form) {
  status = true;
  for (key in form){
    if (form[key] == ""){
      status = false;   
    }
  }
  console.log("form valid", status);
  return status;
}


module.exports = {
  handleToDos,
  handleData,
  handleOrder,
};
