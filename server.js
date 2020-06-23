"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const path = require("path");

const PORT = process.env.PORT || 8000;

// store all the todo items in an array
let item = [];

// ex 1 - display the ToDo page with list
const handleToDo = (req, res) => {
  res.status(200).render("../pages/todo", {
    item: item,
  });
};

// ex 1 - add new item into array and refresh the ToDo page
const handleAddItem = (req, res) => {
  let newItem = req.body.item;
  console.log(newItem);
  item.push(newItem);
  res.redirect("/todos");
};

// ex 2
const { stock, customers } = require("./data/promo");

// ex 2 - form validation
const validateForm = (req, res) => {
  let formData = req.body;

  customers.forEach((customer) => {
    if (
      formData.givenName === customer.givenName &&
      formData.surname === customer.surname &&
      formData.address == customer.address
    ) {
      res.status(200).json({
        status: "error",
        error: "repeat-customer",
      });
    }
  });

  if (formData.country.toLowerCase() !== "canada") {
    res.status(200).json({
      status: "error",
      error: "undeliverable",
    });
  } else if (
    Number(stock["shirt"][formData.size] === 0) ||
    stock[formData.order] == 0
  ) {
    res.status(200).json({
      status: "error",
      error: "unavailable",
    });
    // } else if (formData) {
    //   for (let value in formData) {
    //     if (formData[value] === "") {
    //       res.status(200).json({
    //         status: "error",
    //         error: "missing-data",
    //       });
    //     }
    //   }
  } else {
    res.status(200).json({
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
  .get("/todos", handleToDo)
  .post("/addItem", handleAddItem)
  .post("/order", validateForm)
  .get("/order-confirmed", (req, res) => {
    res
      .status(200)
      .sendFile(path.join(__dirname + "/public/order-confirmed.html"));
  })

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
