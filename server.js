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
  let orderResult = validateData(orderData);
  if (orderResult.status === "error") {
    res.send({ status: "error", error: `${orderResult.error}` });
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
    let listItem = {
      name: item,
    };

    items.push(listItem);
    res.redirect("/todos");
  })

  // I know i'm supposed to use .delete but the same code triggers a 404 when the method is delete (both in the html and here)
  .post("/doneItem", (req, res) => {
    const { itemName } = req.body;
    let thisItem = items.find((item) => item.name === itemName);
    thisItem.done = true;
    res.redirect("/todos");
  })

  .post("/deleteItem", (req, res) => {
    const { index } = req.body;
    items.splice(index, 1);
    res.redirect("/todos");
  })

  .post("/order", handleOrderSubmit)

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
