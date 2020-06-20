"use strict";

const todoList = [];
const { stock, customers } = require("./data/promo");

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

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
  .get("/todos", (req, res) => {
    res.render("pages/todo", { list: todoList });
  })
  .post("/data", (req, res) => {
    const { item } = req.body;
    todoList.push(item);
    res.redirect("/todos");
  })
  .get("/order-form", (req, res) => {
    res.render("order-form/index");
  })
  .post("/order", (req, res) => {
    const userPurchased = customers.find(
      (x) =>
        x.givenName === req.body.givenName && x.address === req.body.address
    );

    const response = { status: "success" };
    if (userPurchased) {
      response.status = "error";
      response.error = "repeat-customer";
      res.json(response);
    }

    if (req.body.country.toLowerCase() !== "canada") {
      response.status = "error";
      response.error = "undeliverable";
      res.json(response);
    }

    if (req.body.order === "shirt") {
      if (parseInt(stock.shirt[req.body.size]) === 0) {
        response.status = "error";
        response.error = "unavailable";
        res.json(response);
      }
    } else {
      if (parseInt(stock[req.body.order]) === 0) {
        response.status = "error";
        response.error = "unavailable";
        res.json(response);
      }
    }

    Object.keys(req.body).forEach((key) => {
      if (!req.body[key] || req.body[key] === "") {
        response.status = "error";
        response.error = "missing-data";
        res.json(response);
      }
    });

    if (response.status === "success") {
      customers.push(req.body);
      if (req.body.order === "shirt") {
        stock.shirt[req.body.size] -= 1;
      } else {
        stock[req.body.order] -= 1;
      }
      res.json(response);
    }
  })
  // .get("/order-confirmed", (req, res) => {
  //   res.render("/order-confirmed");
  //   // res.send("Success");
  // })
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
