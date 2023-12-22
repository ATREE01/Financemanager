const express = require('express');
const route = express.Router();
const Test = require('../controllers/Test');

route.post("/", Test.Test);

module.exports = route;