const express = require('express');
const route = express.Router();
const RefreshTokenController = require("../controllers/RefreshTokenController");

route.get('/', RefreshTokenController.Refresh)

module.exports = route;