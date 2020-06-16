"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const { stock, customers } = require("./data/promo");

const PORT = process.env.PORT || 8000;

// todo list items
const items = [];

const handleFormData = (req, res) => {
	const { item } = req.body;
	items.push(item);
	res.render("pages/homepage", { items: items });
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
	// todo endpoints
	.get("/todos", (req, res) => {
		res.render("pages/homepage", { items: items });
	})
	.post("/data", handleFormData)

	// order form endpoints
	.get("/order-form", (req, res) => {
		res.render("pages/orders");
	})

	.post("/order", (req, res) => {
		console.log(req.body);
		const { givenName } = req.body;
		const { surname } = req.body;
		const { country } = req.body;

		// make if statements to check if there are errors
		// import  promo.js to have acceess to stocks and customers
		// compare req.body information to stocks and customer to see if there are errors
		if (
			customers.find(
				(customer) =>
					customer.givenName === givenName && surname === customer.surname
			)
		) {
			res.send(
				JSON.stringify({
					status: "error",
					error: "repeat-customer",
				})
			);
		} else if (stock === "0") {
			res.send(
				JSON.stringify({
					status: "error",
					error: "Item out of stock. :(",
				})
			);
		} else if (customers.find((customer) => customer.country !== "Canada")) {
			res.send(
				JSON.stringify({
					status: "error",
					error: "Outside of delivery zone. :(",
				})
			);
		}
		// Orders confirming when they shouldn't be ^^^ (stock, country)
		res.send(
			JSON.stringify({
				status: "success",
			})
		);
	})

	.get("/order-confirmed", (req, res) => {
		res.render("pages/order-confirmed");
	})

	.get("*", (req, res) => res.send("Dang. 404."))
	.listen(PORT, () => console.log(`Listening on port ${PORT}`));
