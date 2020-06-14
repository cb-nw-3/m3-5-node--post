const { customers, stock } = require("../data/promo");

//empty array to hold items in the to-do list
let items = [];

//renders the todo-page.ejs via .get()
const handleHomePage = (req, res) => {
  res.render("todo-page", { items: items });
};

//handles form data via .post() and redirects the to-do page with updated items
const handleData = (req, res) => {
  //create variable to hold value of input text from the form
  let { item } = req.body;
  console.log(item);

  //push the value into the items array
  items.push(item);
  console.log("the current items are:", items);

  //redirect to the todos endpoint to re-render the page with new items
  res.status(200).redirect("/todos");
};

const handleForm = (req, res) => {
  console.log(req.body);
  let completedForm = req.body;

  let customerNames = [];
  let customerAddress = [];
  customers.forEach((customer) => customerNames.push(customer.givenName));
  customers.forEach((customer) => customerAddress.push(customer.address));
  console.log(customerNames);

  customers.forEach((customer) => {
    if (
      customer.givenName === completedForm.givenName &&
      customer.address === completedForm.address
    ) {
      console.log("client already exists");
      res.send(JSON.stringify({ status: "error", error: "repeat-customer" }));
    }
  });

  if (completedForm.country !== "Canada") {
    console.log("Cannot deliver outside Canada");
    res.send(JSON.stringify({ status: "error", error: "undeliverable" }));
  }

  // if (completedForm.stock >= 0) {
  //   console.log("Cannot deliver outside Canada");
  //   res.send(JSON.stringify({ status: "error", error: "undeliverable" }));
  // }

  if (!Object.values(completedForm).includes("undefined")) {
    console.log("Form is Completed!");
    res.send(JSON.stringify({ status: "success" }));
  } else {
    console.log("form is missing info");
    res.send(JSON.stringify({ status: "error", error: "missing-data" }));
  }

  // if (
  //   customerNames.includes(completedForm.givenName) &&
  //   customerAddress.includes(completedForm.address)
  // ) {
  //   console.log("client already exists");
  //   res.send(JSON.stringify({ status: "error", error: "repeat-customer" }));
  // } else {
  //   console.log("form completed!");
  //   res.send(JSON.stringify({ status: "success" }));
  // }
};

//export all handlers
module.exports = {
  handleHomePage: handleHomePage,
  handleData: handleData,
  handleForm: handleForm,
};
