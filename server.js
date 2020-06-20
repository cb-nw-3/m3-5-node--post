"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

// store all the todo items in an array
let item = [];

const handleToDo = (req, res) => {
  res.status(200).render("../pages/todo", {
    item: item,
  });
};

const handleAddItem = (req, res) => {
  let newItem = req.body.item;
  console.log(newItem);
  item.push(newItem);
  res.redirect("/todos");
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

  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
