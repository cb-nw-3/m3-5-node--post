"use strict";
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;
const todoList = [];
const app = express()
  .use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  })
  .use(morgan("tiny"))
  .use(express.static("public"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs");
// create endpoints
const todos = (req, res) => {
  console.log("getting");
  res.render("pages/homepage", {
    title: "To do list",
    items: todoList,
  });
};
const newData = (req, res) => {
  const { item } = req.body;
  //const item = req.body.item (object destructuring above)
  // we are establishing that the item is a property we are taking value of and storing.
  //In request/ body/ in body item
  todoList.push(item);
  res.redirect("/");
};
//ex 2
let names = [];
let addresses = [];
let { stock, customers } = require("./data/promo");
//existing customers are pushed into arrays so that they cannot be on free gift list
customers.forEach((customer) => {
  names.push(`${customer.givenName} ${customer.surname}`);
  addresses.push(customer.address);
});
app.post("/order", (req, res) => {
  console.log(req.body);
  const data = req.body;
  //this data above is declared so that belwo once it is again taken as data no second gift possible
  if (
    names.includes(`${data.givenName} ${data.surname}`) ||
    addresses.includes(data.address)
  ) {
    res.status(500).json({ status: "error", error: "repeat-customer" });
    return;
  }
  if (data.country != "Canada") {
    res.status(500).json({ status: "error", error: "undeliverable" });
    return;
  }
  if (data.order === "shirt") {
    let shirtStock = stock.shirt[data.size];
    shirtStock = parseInt(shirtStock);
    if (shirtStock <= 0) {
      res.status(500).json({ status: "error", error: "unavailable" });
      return;
    }
  }
  let productStock = stock[data.order];
  productStock = parseInt(productStock);
  if (productStock <= 0) {
    res.status(500).json({ status: "error", error: "unavailable" });
    return;
  }
  names.push(`${data.givenName} ${data.surname}`);
  addresses.push(data.address);
  res.status(200).json({ status: "success" });
});
app.get("/", todos);
// create an endpoint called `/data` to receive the data from the form `post
app.post("/form-data", newData);
app.get("*", (req, res) => res.send("Dang. 404."));
app.listen(PORT, () => console.log(`Listening on port ${PORT}`));

