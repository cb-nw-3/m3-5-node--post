"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const PORT = process.env.PORT || 8000;
let itemList = [];
let btnArray = [];
let itemCounter = 0;
let confirmOrder = {};
const { customers, stock } = require("./data/promo");

const welcomePage = (req, res) => {
  let welcomeBanner = "Welcome to Your ToDo List";
  res.render("pages/welcome", { welcomeBanner });
};

const todosList = (req, res) => {
  let welcomeBanner = "Enter Your Task";
  let taskBanner = "";
  if (itemList.length === 0) {
    taskBanner = "List is empty";
  } else {
    taskBanner = "You have " + itemList.length + " item(s) in your list";
  }
  res.render("pages/todo", {
    welcomeBanner,
    taskBanner,
    itemList,
  });
};
const addItem = (req, res) => {
  let itemEntered = {
    item: req.body.itemName,
  };
  itemList.push(itemEntered);
  res.redirect("/todos");
};

const promoOrder = (req, res) => {
  let orderResult = {};
  const orderDetail = {
    order: req.body.order,
    size: req.body.size,
    givenName: req.body.givenName,
    surname: req.body.surname,
    email: req.body.email,
    address: req.body.address,
    city: req.body.city,
    province: req.body.province,
    postcode: req.body.postcode,
    country: req.body.country,
  };
  if (validateOrder(orderDetail) == "success") {
    orderResult = {
      status: "success",
    };
    confirmOrder = orderDetail;
    addClient(orderDetail);
    adjustStock(orderDetail);
  } else {
    orderResult = validateOrder(orderDetail);
  }
  res.send(JSON.stringify(orderResult));
};

function adjustStock(order) {
  let itemSelected = order.order;
  let sizeSelected = order.size;
  if (itemSelected != "shirt") {
    let newStock = stock[itemSelected] - 1;
    stock[itemSelected] = newStock.toString();
  } else {
    let newStock = stock[itemSelected][sizeSelected] - 1;
    stock[itemSelected][sizeSelected] = newStock.toString();
  }
  console.log("stock: ", stock);
}

function addClient(order) {
  let newOrder = {
    givenName: order.givenName,
    surname: order.surname,
    email: order.email,
    address: order.address,
    city: order.city,
    province: order.province,
    postcode: order.postcode,
    country: order.country,
  };
  customers.push(newOrder);
  console.log("customers: ", customers);
}

function validateOrder(order) {
  let message = "success";
  let personalInfoResult = checkPersonalInfo(order);
  let countryResult = checkCountryInfo(order);
  let addressResult = checkaddressInfo(order);
  let StockAvailabilityResult = checkStockAvailability(order);
  let addressFieldResult = checkAllAddressFields(order);

  if (personalInfoResult.status != "success") {
    message = personalInfoResult;
  } else if (countryResult.status != "success") {
    message = countryResult;
  } else if (StockAvailabilityResult.status != "success") {
    message = StockAvailabilityResult;
  } else if (addressFieldResult.status != "success") {
    message = addressFieldResult;
  } else if (addressResult.status != "success") {
    message = addressResult;
  }
  return message;
}
function checkaddressInfo(order) {
  let addressStatus = {};
  let addressAlreadyExist = customers.some(function (address) {
    return address.address == order.address;
  });
  if (addressAlreadyExist) {
    console.log("already has an address");
    addressStatus = {
      status: "error",
      error: "repeat-customer",
    };
  } else {
    addressStatus = {
      status: "success",
    };
  }
  return addressStatus;
}

function checkAllAddressFields(order) {
  let addressFieldStatus = {};
  if (
    order.address.length < 2 ||
    order.city.length < 2 ||
    order.province.length < 2 ||
    order.postcode.length < 2 ||
    order.country.length < 2
  ) {
    addressFieldStatus = {
      status: "error",
      error: "missing-data",
    };
  } else {
    addressFieldStatus = {
      status: "success",
    };
  }
  console.log("addressFieldStatus", addressFieldStatus);
  return addressFieldStatus;
}

function checkStockAvailability(order) {
  let stockStatus = {};
  let isOrderAvailable = false;
  let orderSelected = order.order;
  let sizeSelected = order.size;
  if (stock[orderSelected][sizeSelected] > 0) {
    isOrderAvailable = true;
  } else if (stock[orderSelected] > 0) {
    isOrderAvailable = true;
  }
  if (isOrderAvailable) {
    stockStatus = {
      status: "success",
    };
  } else {
    stockStatus = {
      status: "error",
      error: "unavailable",
    };
  }
  return stockStatus;
}
function checkCountryInfo(order) {
  let countryStatus = {};
  let isWithinCanada = order.country == "Canada" ? true : false;
  if (!isWithinCanada) {
    countryStatus = {
      status: "error",
      error: "undeliverable",
    };
  } else {
    countryStatus = {
      status: "success",
    };
  }
  return countryStatus;
}

function checkPersonalInfo(order) {
  let clientStatus = {};
  let emailExist = false;
  let firstNameExist = false;
  let lastNameExist = false;

  let alreadyExists = customers.some((client) => {
    emailExist = client.email === order.email;
    firstNameExist = client.givenName === order.givenName;
    lastNameExist = client.surname === order.surname;
    return emailExist && firstNameExist && lastNameExist;
  });

  if (alreadyExists) {
    clientStatus = {
      status: "error",
      error: "repeat-customer",
    };
  } else {
    clientStatus = {
      status: "success",
    };
  }
  return clientStatus;
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
  .get("/", welcomePage)
  .get("/todos", todosList)
  .post("/addItem", addItem)
  .post("/order", promoOrder)
  .get("/order-confirmed", (req, res) => {
    let welcomeBanner = "Order Confirmation";
    res.render("pages/order-confirmation", { confirmOrder, welcomeBanner });
  })
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
