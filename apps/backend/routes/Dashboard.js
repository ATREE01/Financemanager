const express = require('express');
const router = express.Router();
const DashBoardController = require('../controllers/DashboardController.js');

router.get("/getBankAreaChartData", DashBoardController.getBankAreaChartData),
router.get("/getBankData", DashBoardController.getBankData);
router.get("/getInvtAreaChartData", DashBoardController.getInvtAreaChartData);
router.get("/getInvtData", DashBoardController.getInvtData);


module.exports = router;