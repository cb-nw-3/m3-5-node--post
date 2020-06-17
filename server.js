"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { stock, customers } = require("./data/promo");

const PORT = process.env.PORT || 8000;

//Handlers

let list = [];
const todoHandler = (req, res) => {
  res.status(200).render("pages/todoList.ejs", { items: list });
};
const dataHandler = (req, res) => {
  list.push(req.body.item);
  res.redirect("/todos");
};

const validationHandler = (req, res) => {
  let error = {};
  let data = req.body;
  if (data.country !== "Canada") {
    console.log("out of canada");
    error.status = "error";
    error.error = "undeliverable";
  } else if (data.size > parseInt(stock["${data.order}"])) {
    console.log("unavailable");
    error.status = "error";
    error.error = "unavailable";
  } else if (data.givenname && data.surname && data.address) {
    customers.forEach((customer) => {
      if (customer.address === data.address) {
        console.log("repeat");
        error.status = "error";
        error.error = "repeat-customer";
      } else if (
        customer.givenname === data.givenname &&
        customer.surname === data.surname
      ) {
        console.log("repeat name");
        error.status = "error";
        error.error = "repeat-customer";
      }
    });
  } else {
    error.status = "success";
  }
  res.json(error);
};

//make sure the address is valid
//respond with JSON
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
  .use(express.static("public/order-form"))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")
  .get("/todos", todoHandler)
  .post("/data", dataHandler)
  .post("/order", validationHandler)
  .get("/order-confirmed", (req, res) => {
    res.render("pages/order-confirmed");
  })

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
