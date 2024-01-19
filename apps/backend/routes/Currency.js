const express = require("express");
const route = express.Router();
const CurrencyController = require("../controllers/CurrencyController");

route.get("/getExchangeRate", CurrencyController.getExchangeRate);
route.post("/addUserCurrency", CurrencyController.addUserCurrency);
route.get("/getUserCurrency", CurrencyController.getUserCurrency);
route.delete("/deleteUserCurrency", CurrencyController.deleteUserCurrency);

module.exports = route;