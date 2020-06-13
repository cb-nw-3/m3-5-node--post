"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

let items = [];
let { validateData, updateDatabase } = require("./serverFunctions");
let orderData = {};

function handleOrderSubmit(req, res) {
  orderData = req.body;

  //check errors
  if (validateData(orderData).status === "error") {
    res.send({ status: "error", error: `${validateData(orderData).error}` });
  } else {
    // update database
    updateDatabase(orderData);
    //resolve success
    res.status(200).send({ status: "success" });
  }
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
