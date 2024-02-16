const express = require('express');
const router = express.Router();
const RefreshTokenController = require("../controllers/RefreshTokenController");

router.get('/', RefreshTokenController.Refresh)

module.exports = router;