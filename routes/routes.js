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
let completedForm = undefined;
const handleForm = (req, res) => {
  //obtain the response data from the form
  console.log(req.body);
  completedForm = req.body;

  //this will handle stock validation for tshirts in various sizes
  if (completedForm.order === "shirt") {
    //let { small, medium, large, xlarge } = stock.shirt;
    //console.log(small, medium, large, xlarge);

    //depending on what size, we check if its in stock, if not decrement
    //and send back json response
    switch (completedForm.size) {
      case "small":
        if (stock.shirt.small > 0) {
          console.log("you bought a small shirt");
          stock.shirt.small--;
          break;
        } else {
          res.send(JSON.stringify({ status: "error", error: "unavailable" }));
          break;
        }
      case "medium":
        if (stock.shirt.medium > 0) {
          console.log("you bought a medium shirt");
          stock.shirt.medium--;
          break;
        } else {
          console.log("no more shirts in this size");
          res.send(JSON.stringify({ status: "error", error: "unavailable" }));
          break;
        }
      case "large":
        if (stock.shirt.large > 0) {
          console.log("you bought a large shirt");
          stock.shirt.large--;
          break;
        } else {
          console.log("no more shirts in this size");
          res.send(JSON.stringify({ status: "error", error: "unavailable" }));
          break;
        }
      case "xlarge":
        if (stock.shirt.xlarge > 0) {
          console.log("you bought a xlarge shirt");
          stock.shirt.xlarge--;
          break;
        } else {
          console.log("no more shirts in this size");
          res.send(JSON.stringify({ status: "error", error: "unavailable" }));
          break;
        }
    }
    //get a total tally of current stock to see if decrement works
    //console.log("you now have", stock.shirt);
  }

  //this will cover the bottles and socks stock validation
  switch (completedForm.order) {
    case "bottles":
      if (stock.bottles > 0) {
        completedForm.size = 1;
        stock.bottles--;
        console.log("your stock in socks is now", stock.bottles);
        break;
      } else {
        console.log("no more bottles left");
        res.send(JSON.stringify({ status: "error", error: "unavailable" }));
        break;
      }
    case "socks":
      if (stock.socks > 0) {
        completedForm.size = 1;
        stock.socks--;
        console.log("your stock in socks is now", stock.socks);
        break;
      } else {
        console.log("no more socks left");
        res.send(JSON.stringify({ status: "error", error: "unavailable" }));
        break;
      }
  }

  //let customerNames = [];
  //let customerAddress = [];
  //customers.forEach((customer) => customerNames.push(customer.givenName));
  //customers.forEach((customer) => customerAddress.push(customer.address));
  //console.log(customerNames);

  //loop through each customer object and verify that their name and address
  //are not repeated on the form
  customers.forEach((customer) => {
    if (
      customer.givenName === completedForm.givenName &&
      customer.address === completedForm.address
    ) {
      console.log("client already exists");
      res.send(JSON.stringify({ status: "error", error: "repeat-customer" }));
    }
  });

  //verify that the country the product is shipping to is Canada
  if (completedForm.country !== "Canada") {
    console.log("Cannot deliver outside Canada");
    res.send(JSON.stringify({ status: "error", error: "undeliverable" }));
  }

  // if (completedForm.stock >= 0) {
  //   console.log("Cannot deliver outside Canada");
  //   res.send(JSON.stringify({ status: "error", error: "undeliverable" }));
  // }

  //if all fields in the form are not undefined then form has been filled
  //properly
  if (completedForm && !Object.values(completedForm).includes("undefined")) {
    console.log("Form is Completed!");
    res.send(JSON.stringify({ status: "success" }));
    console.log(completedForm);
  } else {
    console.log("form is missing info");
    res.send(JSON.stringify({ status: "error", error: "missing-data" }));
    console.log(completedForm);
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

//this is part of the stretch goal to render dynamic info in the confirmation page
const handleOrder = (req, res) => {
  // let completedForm = req.body;
  if (!completedForm) {
    return;
  }
  console.log(completedForm);
  console.log("handling the order now for: ", completedForm);
  res.render("order-confirmed", { data: completedForm });

  //once the order has been handled, wipe the global var.
  completedForm = undefined;
};

//export all handlers
module.exports = {
  handleHomePage: handleHomePage,
  handleData: handleData,
  handleForm: handleForm,
  handleOrder: handleOrder,
};
