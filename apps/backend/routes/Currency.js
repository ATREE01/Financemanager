const express = require("express");
const router = express.Router();
const CurrencyController = require("../controllers/CurrencyController");

router.get("/getExchangeRate", CurrencyController.getExchangeRate);
router.get("/getCurTRRecord", CurrencyController.getCurTRRecord);
router.get("/getCurTRRecordSum", CurrencyController.getCurTRRecordSum);
router.post("/addCurTRRecord", CurrencyController.addCurTRRecord);
router.patch("/modifyCurTRRecord", CurrencyController.modifyCurTRRecord);
router.delete("/deleteCurTRRecord", CurrencyController.deleteCurTRRecord);
router.post("/addUserCurrency", CurrencyController.addUserCurrency);
router.get("/getUserCurrency", CurrencyController.getUserCurrency);
router.delete("/deleteUserCurrency", CurrencyController.deleteUserCurrency);

module.exports = router;