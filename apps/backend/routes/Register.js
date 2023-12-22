const express = require("express");
const route = express.Router();
const RegisterController = require('../controllers/Register');

route.post("/",  RegisterController.Register);

module.exports = route;