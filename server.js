"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

let items = [];
let { stock, customers } = require("./data/promo");
let orderData = {};

function handleOrderSubmit(req, res) {
  orderData = req.body;

  //check errors
  if (validateData(orderData).status === "error") {
    res.send({ status: "error", error: `${validateData(orderData).error}` });
  }

  res.status(200).send({ status: "success" });
}

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

  .get("/todos", (req, res) => res.render("./pages/todos", { items: items }))
  .get("/order-confirmed", (req, res) =>
    res.render("./pages/order-confirmed", { orderData: orderData })
  )

  .post("/data", (req, res) => {
    const { item } = req.body;
    items.push(item);
    res.redirect("/todos");
  })
  .post("/order", handleOrderSubmit)

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));

function validateData(data) {
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
  } = data;

  if (order === "undefined") {
    return { status: "error", error: "unavailable" };
  }
  //deliverability check
  if (country.toLowerCase() !== "canada") {
    return { status: "error", error: "undeliverable" };
  }
  console.log("country ok ");
  //repeat customer check
  if (
    customers.find(
      (customer) => customer.address.toLowerCase() === address.toLowerCase()
    )
  ) {
    return { status: "error", error: "repeat-customer" };
  }
  console.log("address unique ok ");
  //repeat customer check
  if (
    customers.find(
      (customer) => customer.givenName.toLowerCase() === givenName.toLowerCase()
    ) &&
    customers.find(
      (customer) => customer.surname.toLowerCase() === surname.toLowerCase()
    )
  ) {
    return { status: "error", error: "repeat-customer" };
  }
  console.log("name unique ok ");
  //stock check
  if (order === "shirt" && stock[order][size] <= 0) {
    return { status: "error", error: "unavailable" };
  } else if (stock[order] <= 0) {
    return { status: "error", error: "unavailable" };
  }
  console.log("stock ok and all ok");

  return { status: "success" };
}
