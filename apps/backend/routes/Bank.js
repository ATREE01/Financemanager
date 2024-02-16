const express = require('express');
const router = express.Router();
const BankController = require('../controllers/BankController');

router.post('/getBank', BankController.getBank);
router.post('/addBank', BankController.addBank);
router.post('/addBankRecord', BankController.addBankRecord);
router.post('/getBankRecord', BankController.getBankRecord);
router.post('/getBankRecordSum', BankController.getBankRecordSum);
router.patch('/modifyBankRecord', BankController.modifyBankRecord);
router.delete('/deleteBankRecord', BankController.deleteBankRecord);
router.post('/addTimeDepositRecord', BankController.addTimeDepositRecord);
router.post('/getTimeDepositRecord', BankController.getTimeDepositRecord);
router.post('/getTimeDepositRecordSum', BankController.getTimeDepositRecordSum);
router.delete('/deleteTimeDepositRecord', BankController.deleteTimeDepositRecord);
router.post('/modifyTimeDepositRecord', BankController.modifyTimeDepositRecord);


module.exports = router;

