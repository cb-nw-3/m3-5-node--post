"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");

const PORT = process.env.PORT || 8000;

//array of items in the todo list
const items = [];

const homePage = (req, res) => res.render("./pages/todos", { items });

//add each submited item at the items array through body request and redirect to 'todos' page
const todoData = (req, res) => {
    const { item } = req.body;

    items.push(item);

    res.redirect('/todos');
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
    .get("/todos", homePage)
    .post("/data", todoData)

    .get("*", (req, res) => res.send("Dang. 404."))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
