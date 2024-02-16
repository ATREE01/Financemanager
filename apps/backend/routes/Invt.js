const express = require("express");
const router = express.Router();
const InvtController = require("../controllers/InvtController")

router.get("/getBrokerage", InvtController.getBrokerage);
router.post("/addBrokerage", InvtController.addBrokerage);
router.get("/getStock", InvtController.getStock);
router.get("/getStockPrice", InvtController.getStockPrice);
router.post("/addStock", InvtController.addStock);
router.get("/getStockRecordSum", InvtController.getStockRecordSum);
router.get("/getStockRecord", InvtController.getStockRecord);
router.get("/getStkRecPriceSum", InvtController.getStkRecPriceSum)
router.post("/addStockRecord", InvtController.addStockRecord);
router.patch("/modifyStockRecord", InvtController.modifyStockRecord);
router.delete("/deleteStockRecord", InvtController.deleteStockRecord);
router.get("/getDividnedRecord", InvtController.getDividendRecord);
router.get("/getDividendRecordSum", InvtController.getDividendRecordSum);
router.post("/addDividendRecord", InvtController.addDividendRecord),
router.patch("/modifyDividendRecord", InvtController.modifyDividendRecord);
router.delete("/deleteDividendRecord", InvtController.deleteDividendRecord);


router.get("/getInvtRecordSum", InvtController.getInvtRecordSum);

module.exports = router;