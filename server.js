"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const items = [];
const { stock, customers } = require("./data/promo");

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
    .post("/form-data", (req, res) => {
        const { item } = req.body;
        items.push(item);
        res.redirect("/todos");
    })

    .post("/order", function (req, res) {
        const order = {
            email: req.body.email,
            size:  req.body.size,
            givenName: req.body.givenName,
            surname: req.body.surname,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            postcode: req.body.postcode,
            country: req.body.country
        }; console.log(order);

        if(order.givenName==='Rick' && order.surname === 'Sanchez' || order.givenName === 'John' && order.surname === 'Doe'){
            res.send({
                "status": "error",
                "error": "repeat-customer"
                })

               
                }else if(req.body.country !== 'Canada'){
                    console.log('Undeliverable');
                }else if(stock.bottles === 0){

                }else if(req.body.email === '' || req.body.size === '' || req.body.givenName === '' || req.body.surname === '' ||  req.body.address === '' || req.body.city === '' || req.body.province === '' || req.body.postcode ==='' || req.body.country === ''){

                }else{}
       // }      

       res.status(200).send("worked")      
          
         //res.redirect("/order-confirmed");   
     })
        

    .get("/todos", function (req, res) {
        res.render("todos.ejs", { items: items });
    })

    .get("*", (req, res) => res.send("Dang. 404."))
    .listen(PORT, () => console.log(`Listening on port ${PORT}`));
