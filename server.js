"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { stock, customers } = require("./data/promo");
let user = {};

const PORT = process.env.PORT || 8000;

let items = [];

const handleList = (req, res) => {
  res.render("pages/todo", { items: items });
};

const handleData = (req, res) => {
  let { item } = req.body;
  items.push(item);
  res.redirect("/todo");
};

function isPresentInDataBase(item) {
  let itemIsPresent = false;
  customers.forEach((object) => {
    if (Object.values(object).includes(item)) {
      itemIsPresent = true;
    }
  });
  return itemIsPresent;
}

const formValidation = (req, res) => {
  let { givenName, surname, address, country, order, size } = req.body;
  console.log(req.body);
  user = req.body;
  if (
    (isPresentInDataBase(givenName) && isPresentInDataBase(surname)) ||
    isPresentInDataBase(address)
  ) {
    res.json({
      status: "error",
      error: "repeat-customer",
    });
  }
  if (country.toLowerCase() !== "canada") {
    res.json({
      status: "error",
      error: "undeliverable",
    });
  }
  if (size === undefined && stock[order] === 0) {
    res.json({
      status: "error",
      error: "unavailable",
    });
  }
  if (order === "shirt" && stock.shirt[size] === "0") {
    res.json({
      status: "error",
      error: "unavailable",
    });
  }
  if (Object.values(req.body).includes("")) {
    res.json({
      status: "error",
      error: "missing-data",
    });
  } else {
    console.log(req.body.email);
    res.json({
      status: "success",
    });
  }
};

express()
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
  .set("view engine", "ejs")

  // endpoints
  .get("/todo", handleList)
  .post("/data", handleData)

  .post("/order", formValidation)
  .get("/order-confirmed", (req, res) => {
    res.render("pages/order", { user: user });
  })

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
