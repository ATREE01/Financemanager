const express = require('express');
const route = express.Router();
const BankController = require('../controllers/BankController');

route.post('/getBank', BankController.getBank);
route.post('/addBank', BankController.addBank);
route.post('/addBankRecord', BankController.addBankRecord);
route.post('/getBankRecord', BankController.getBankRecord);
route.post('/getBankRecordSum', BankController.getBankRecordSum);
route.patch('/modifyBankRecord', BankController.modifyBankRecord);
route.delete('/deleteBankRecord', BankController.deleteBankRecord);
route.post('/addTimeDepositRecord', BankController.addTimeDepositRecord);
route.post('/getTimeDepositRecord', BankController.getTimeDepositRecord);
route.post('/getTimeDepositRecordSum', BankController.getTimeDepositRecordSum);
route.delete('/deleteTimeDepositRecord', BankController.deleteTimeDepositRecord);
route.post('/modifyTimeDepositRecord', BankController.modifyTimeDepositRecord);


module.exports = route;

