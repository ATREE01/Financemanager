const express = require('express');
const router = express.Router();
const IncExpController = require("../controllers/IncExpController");

router.post('/AddIncExpRecord', IncExpController.AddIncExpRecord);
router.post('/GetIncExpRecord', IncExpController.GetIncExpRecord);
router.post('/GetIncExpRecordSum', IncExpController.GetIncExpRecordSum);
router.post('/GetIncExpFinRecordSum', IncExpController.GetIncExpFinRecordSum);

router.post('/AddIncExpCategory', IncExpController.AddIncExpCategory);
router.post('/GetIncExpCategory', IncExpController.GetIncExpCategory);



module.exports = router;

