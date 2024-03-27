const uuid4 = require('uuid4');
const mysql = require('mysql');
const dbconfig = require('../config/dbconfig.js');

const getBank = (req, res) =>{
    const data = req.body;
    const user_id = data.user_id;
    const sql = `SELECT bank_id, name, currency, initialAmount FROM Bank WHERE user_id = ? ORDER BY ID`;
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [user_id], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    }); 
    connection.end();
}

const addBank = (req, res) =>{
    const data = req.body;
    const user_id = data.user_id;
    const bank_id = uuid4();
    const name = data.name;
    const currency = data.currency;
    const initialAmount = data.initialAmount;
    const sql = `INSERT INTO Bank (user_id, bank_id, name, currency, initialAmount) VALUES (?, ?, ?, ?, ?)`;
    const connection = mysql.createConnection(dbconfig)
    connection.query(sql, [user_id, bank_id, name, currency, initialAmount], (error, result) => {
        if(error){
            console.log(error);
            res.json({success: 0, errno: error.errno});
        }
        else{
            res.json({success: 1});
        }
    })
    connection.end();
}

const getBankRecord = (req, res) => {
    const data = req.body;
    const sql = "SELECT * FROM BankRecord WHERE user_id = ? ORDER BY date DESC";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.user_id], (error, result) => {
        if(error){
            console.log(error)
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const getBankRecordSum = (req, res) => {
    const data = req.body;
    const user_id = data.user_id;
    const sql = 
        `SELECT 
            bank_id,
            IFNULL(SUM(sum_charge), 0) AS charge,
            JSON_ARRAYAGG(
            JSON_OBJECT(type, sum_amount)
            ) AS result
        FROM (
            SELECT 
            bank_id,
            type,
            SUM(amount) AS sum_amount,
            SUM(charge) AS sum_charge
            FROM BankRecord 
            WHERE user_id = ?
            GROUP BY bank_id, type
        ) AS subquery
        GROUP BY bank_id;`;
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [user_id], (error, result) => {
        const result_dict = {};
        result.forEach(element => {
            result_dict[element['bank_id']] = {
                result: element['result'],
                charge: element['charge']
            }
        });
        if(error){
            console.log(error);
            return res.sendStatus(500) //server error
        }
        res.json(result_dict);
    })
    connection.end();
}

const modifyBankRecord = (req, res) => {
    const data = req.body;
    const sql = `UPDATE BankRecord SET user_id = ?, type = ?, date = ?, bank_id = ?, amount = ?, charge = ? WHERE ID = ?`;
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.user_id, data.type, data.date, data.bank, data.amount, data.charge, data.ID], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        else {
            return res.json({success: 1});
        }
    })
    connection.end();
}

const deleteBankRecord = (req, res) => {
    const data = req.body;
    const sql = `DELETE FROM BankRecord WHERE ID = ?`;
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.ID], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}

const addBankRecord = (req, res) => {
    const data = req.body;
    const user_id = data.user_id;
    const date = data.date;
    const type = data.type;
    const bank = data.bank;
    const amount = data.amount;
    const charge = data.charge;
    const currency = data.currency
    const sql = "INSERT INTO BankRecord (user_id, date, type, bank_id, currency, amount, charge) VALUES (?, ?, ?, ?, ?, ?, ?)";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [user_id, date, type, bank, currency, amount, charge], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500) //server error
        }
        res.json({success: 1});
    })
    connection.end();
}

const getTimeDepositRecord = (req, res) =>{
    const data = req.body;
    const user_id = data.user_id;
    const sql = "SELECT * FROM TimeDepositRecord WHERE user_id = ?";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [user_id], (error, result) => {
        if(error){
            console.log(error);
            
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const getTimeDepositRecordSum = (req, res) => {
    const data = req.body;
    const user_id = data.user_id;
    const sql  = "SELECT bank_id, SUM(CASE WHEN endDate >= CURDATE() THEN amount ELSE 0 END) as amoTot FROM TimeDepositRecord WHERE user_id = ? GROUP BY bank_id;";
    const connection = mysql.createConnection(dbconfig);
    let result_dict = {};
    connection.query(sql, [user_id], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        result.forEach(element => {
            result_dict[element['bank_id']] = {
                amoTot: element['amoTot'] //amount total
            }
        });
        res.json(result_dict);
    })
    connection.end();
}

const modifyTimeDepositRecord = (req, res) => {
    const data = req.body;
    const sql  = `UPDATE TimeDepositRecord  SET user_id = ?, bank_id = ?, type = ?, currency = ?, amount = ?, interest = ?, startDate = ?, endDate = ? WHERE ID = ?;`;
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.user_id, data.bank, data.type, data.currency, data.amount, data.interest, data.startDate, data.endDate, data.ID], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}


const deleteTimeDepositRecord = (req, res) => {
    const data = req.body;
    const sql = `DELETE FROM TimeDepositRecord WHERE ID = ?`;
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.ID], (error, result) => {
        console.log(result);
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}


const addTimeDepositRecord = (req, res) =>{
    const data = req.body;
    const user_id = data.user_id;
    const bank = data.bank;
    const type = data.type;
    const currency = data.currency;
    const amount = data.amount;
    const interest = data.interest;
    const startDate = data.startDate;
    const endDate = data.endDate;
    const sql  = `INSERT INTO TimeDepositRecord (user_id, bank_id, type, currency, amount, interest, startDate, endDate)
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`;
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [user_id, bank, type, currency, amount, interest, startDate, endDate], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});      
    });
    connection.end();
}

module.exports = {
    getBank,
    addBank,

    getBankRecord,
    getBankRecordSum,
    modifyBankRecord,
    deleteBankRecord,
    addBankRecord,

    getTimeDepositRecord,
    getTimeDepositRecordSum,
    modifyTimeDepositRecord,
    deleteTimeDepositRecord,
    addTimeDepositRecord,
}