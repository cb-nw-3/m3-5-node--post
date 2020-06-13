let { stock, customers } = require("./data/promo");

function validateData(data) {
  const {
    order,
    size,
    givenName,
    surname,
    email,
    address,
    city,
    province,
    postcode,
    country,
  } = data;

  //console.log(data);

  if (order === "undefined") {
    return { status: "error", error: "unavailable" };
  }
  //deliverability check
  if (country.toLowerCase() !== "canada") {
    return { status: "error", error: "undeliverable" };
  }
  //repeat customer check
  if (
    customers.find(
      (customer) => customer.address.toLowerCase() === address.toLowerCase()
    )
  ) {
    return { status: "error", error: "repeat-customer" };
  }
  //repeat customer check
  if (
    customers.find(
      (customer) => customer.givenName.toLowerCase() === givenName.toLowerCase()
    ) &&
    customers.find(
      (customer) => customer.surname.toLowerCase() === surname.toLowerCase()
    )
  ) {
    return { status: "error", error: "repeat-customer" };
  }
  //stock check
  if (order === "shirt" && stock[order][size] <= 0) {
    return { status: "error", error: "unavailable" };
  } else if (stock[order] <= 0) {
    return { status: "error", error: "unavailable" };
  }

  return { status: "success" };
}

function updateDatabase(orderData) {
  //add customer to database
  customers.push({
    givenName: orderData.givenName,
    surname: orderData.surname,
    email: orderData.email,
    address: orderData.address,
    city: orderData.city,
    province: orderData.province,
    postcode: orderData.postcode,
    country: orderData.country,
  });

  //console.log(customers);

  //update stocks
  let itemBought = orderData.order;
  let shirtSize = orderData.size;

  switch (itemBought) {
    case "bottle":
      stock.bottles = String(Number(stock.bottles) - 1);
      break;
    case "socks":
      stock.socks = String(Number(stock.socks) - 1);
      break;
    case "shirt":
      stock.shirt[shirtSize] = String(Number(stock.shirt[shirtSize]) - 1);
  }

  //console.log(stock);
}

module.exports = { validateData, updateDatabase };
