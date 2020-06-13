"use strict";
const itemsList = [];
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

const handleToDos = (req, res) => {
  res.status(200).render("pages/todos", { itemsList });
};

const handleData = (req, res) => {
  const { item } = req.body;
  itemsList.push(item);
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
  .use(express.json())
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints

  .get("/todos", handleToDos)
  .post("/data", handleData)
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
