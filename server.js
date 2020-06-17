"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

const { stock, customers } = require("./data/promo");

const items = [];

const findCustomer = (name, surname, address) => {
  let nameCheck;
  let surnameCheck;
  let addressCheck;

  customers.forEach((customer) => {
    if (customer.givenName === name) {
      nameCheck = true;
    }
  });

  customers.forEach((customer) => {
    if (customer.surname === surname) {
      surnameCheck = true;
    }
  });

  customers.forEach((customer) => {
    if (customer.address === address) {
      addressCheck = true;
    }
  });

  return nameCheck && surnameCheck && addressCheck;
};

const isOverseas = (country) => {
  let overseasCustomer = false;

  customers.forEach((customer) => {
    if (customer.country !== country) {
      overseasCustomer = true;
    }
  });
  return overseasCustomer;
};

const isOutOfStock = (item, size) => {
  let itemIsOutOfStock = false;

  if (item === "shirt") {
    if (Number(stock[item][size]) < 1) {
      itemIsOutOfStock = true;
    } else {
      if (Number(stock[item]) < 1) {
        itemIsOutOfStock = true;
      }
    }
  } else {
    if (stock[item] < 1) {
      itemIsOutOfStock = true;
    }
  }

  return itemIsOutOfStock;
};

const isDataMissing = (data) => {
  let dataIsMissing;

  if (data.order === "shirt") {
    if (
      data.givenName === "undefined" ||
      data.surname === "undefined" ||
      data.address === "undefined" ||
      data.country === "undefined" ||
      data.order === "undefined" ||
      data.size === "undefined" ||
      data.email === "undefined" ||
      data.city === "undefined" ||
      data.province === "undefined" ||
      data.postcode === "undefined"
    ) {
      dataIsMissing = true;
    }
  } else {
    if (
      data.givenName === "undefined" ||
      data.surname === "undefined" ||
      data.address === "undefined" ||
      data.country === "undefined" ||
      data.order === "undefined" ||
      data.email === "undefined" ||
      data.city === "undefined" ||
      data.province === "undefined" ||
      data.postcode === "undefined"
    ) {
      dataIsMissing = true;
    }
  }

  return dataIsMissing;
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
  .get("/todos", (req, res) => res.render("../views/todos", { items }))

  .post("/data", (req, res) => {
    items.push(req.body.item);
    res.redirect("/todos");
  })

  .post("/order", (req, res) => {
    let response = {};

    const existingCustomer = findCustomer(
      req.body.givenName,
      req.body.surname,
      req.body.address
    );

    const overseas = isOverseas(req.body.country);

    const outOfStock = isOutOfStock(req.body.order, req.body.size);

    const missingData = isDataMissing(req.body);

    if (existingCustomer) {
      response = {
        status: "error",
        error: "repeat-customer",
      };
      res.json(response);
    }

    if (overseas) {
      response = {
        status: "error",
        error: "undeliverable",
      };
      res.json(response);
    }

    if (outOfStock) {
      response = {
        status: "error",
        error: "unavailable",
      };
      res.json(response);
    }

    if (missingData) {
      response = {
        status: "error",
        error: "missing-data",
      };
      res.json(response);
    }

    response = { status: "success" };
    res.json(response);
  })

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
