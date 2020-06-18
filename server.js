"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

let listOfData = [];
let confirmedOrder;
const { stock, customers } = require("./data/promo");

const handleTodOList = (req, res) => {
  res.status(200).render("../pages/todos", { itemList: listOfData });
};

const handleData = (req, res) => {
  const bodyOfPostRequestForData = req.body.data;
  listOfData.push(bodyOfPostRequestForData);
  res.redirect("/todos");
};

const handleOrder = (req, res) => {
  alert(1);
  const bodyOfOrder = req.body;
  const customerObject = {
    givenName: bodyOfOrder.givenName,
    surname: bodyOfOrder.surname,
    email: bodyOfOrder.email,
    address: bodyOfOrder.address,
    city: bodyOfOrder.city,
    province: bodyOfOrder.province,
    postcode: bodyOfOrder.postcode,
    country: bodyOfOrder.country,
  };
  const itemObjectOrder = bodyOfOrder.order;
  const itemObjectSize = bodyOfOrder.size;

  validateCustomer(customerObject, res);
  validateItem(itemObjectOrder, itemObjectSize, res);
};

function validateCustomer(paramCustomerRequestBody, res) {
  customers.forEach((element) => {
    if (
      element.givenName == paramCustomerRequestBody.givenName &&
      element.surname == paramCustomerRequestBody.surname
    ) {
      res.json({
        status: "error",
        error: "repeat-customer",
      });
    }
    if (element.address == paramCustomerRequestBody.address) {
      res.json({
        status: "error",
        error: "repeat-customer",
      });
    }
    if (element.country != "Canada") {
      res.json({
        status: "error",
        error: "undeliverable",
      });
    }

    if (Object.values(paramCustomerRequestBody).includes("")) {
      res.json({
        status: "error",
        error: "missing-data",
      });
    }
  });

  customers.push(paramCustomerRequestBody);

  confirmedOrder = paramCustomerRequestBody;

  res.json({
    status: "success",
  });
}

function validateItem(
  paramItemOrderRequestBody,
  paramItemSizeRequestBody,
  res
) {
  if (paramItemOrderRequestBody == "bottle" && stock.bottles > 0) {
    res.json({
      status: "success",
    });
  }
  if (paramItemOrderRequestBody == "socks" && stock.socks > 0) {
    res.json({
      status: "success",
    });
  }
  if (paramItemOrderRequestBody == "shirt") {
    if (
      paramItemSizeRequestBody == "extralarge" &&
      stock.shirt.extralarge > 0
    ) {
      res.json({
        status: "success",
      });
    }
    if (paramItemSizeRequestBody == "large" && stock.shirt.large > 0) {
      res.json({
        status: "success",
      });
    }
    if (paramItemSizeRequestBody == "medium" && stock.shirt.medium > 0) {
      res.json({
        status: "success",
      });
    }
    if (paramItemSizeRequestBody == "small" && stock.shirt.small > 0) {
      res.json({
        status: "success",
      });
    }
    if (paramItemSizeRequestBody == "undefined") {
      res.json({
        status: "error",
        error: "missing-data",
      });
    }
  }
  if (paramItemOrderRequestBody == "undefined") {
    res.json({
      status: "error",
      error: "missing-data",
    });
  }

  res.json({
    status: "error",
    error: "unavailable",
  });
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
  .get("/todos", handleTodOList)
  .post("/data", handleData)
  .post("/order", handleOrder)
  .get("/order-confirmed", (req, res) =>
    res.render("../pages/orderConfirm", {
      customer: confirmedOrder,
    })
  )
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
