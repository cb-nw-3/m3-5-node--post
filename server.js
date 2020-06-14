"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { handleToDos, handleData} = require('./handlers');
const { stock, customers} = require('./data/promo');
const { response } = require("express");

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
  .get("/", handleToDos)
  .post('/data', handleData)
  .post('/order', (req,res) => {
    if (error === 'unavailable') {
      res.send({ status: 'error', error: unavailable});
    }
    else if (error === 'repeat-customer') {
      res.send({ status: 'error', error: 'repeat-customer'})
    }
    else if (error === 'undeliverable') {
      res.send({ status: 'error', error: undeliverable})
    }
    if (error === 'missing-data') {
      res.send({ status: 'error', error: 'missing-data'})
    }
    res.send({status: 'success'});

    })
  .get("*", (req, res) => res.send("Dang. 404."))
  .listen(PORT, () => console.log(`Listening on port ${PORT}`));
