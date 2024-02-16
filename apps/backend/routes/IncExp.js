const express = require('express');
const router = express.Router();
const IncExpController = require("../controllers/IncExpController");

router.post('/GetIncExpRecord', IncExpController.GetIncExpRecord);
router.post('/GetIncExpRecordSum', IncExpController.GetIncExpRecordSum);
router.post('/GetIncExpFinRecordSum', IncExpController.GetIncExpFinRecordSum);
router.post('/AddIncExpRecord', IncExpController.AddIncExpRecord);
router.patch("/modifyIncExpRecord", IncExpController.modifyIncExpRecord),
router.delete("/deleteIncExpRecord", IncExpController.deleteIncExpRecord);

router.post('/AddIncExpCategory', IncExpController.AddIncExpCategory);
router.get('/GetIncExpCategory', IncExpController.GetIncExpCategory);

module.exports = router;

