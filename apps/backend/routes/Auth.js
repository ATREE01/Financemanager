const express = require('express');
const route = express.Router();
const AuthController = require('../controllers/AuthController');

route.post('/Login', AuthController.Login);
route.post('/Logout', AuthController.Logout);
route.post('/Register', AuthController.Register);
module.exports = route;