const express = require("express");
const router = express.Router();
const CurrencyController = require("../controllers/CurrencyController");

router.get("/getExchangeRate", CurrencyController.getExchangeRate);
router.post("/addUserCurrency", CurrencyController.addUserCurrency);
router.get("/getUserCurrency", CurrencyController.getUserCurrency);
router.delete("/deleteUserCurrency", CurrencyController.deleteUserCurrency);

module.exports = router;