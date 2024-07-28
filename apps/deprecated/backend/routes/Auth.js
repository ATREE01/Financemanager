const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router.post('/Login', AuthController.Login);
router.post('/Logout', AuthController.Logout);
router.post('/Register', AuthController.Register);
module.exports = router;