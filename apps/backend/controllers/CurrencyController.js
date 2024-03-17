const axios = require('axios');
const mysql = require('mysql');
const dbconfig = require('../config/dbconfig.js');

const googleSheetApiURL = "https://script.google.com/macros/s/AKfycbzwK-fuvMUuqx5uuBSF_RWsjVLK-B0k6bZKn1R8AB3kYrLME2kLsMxTVPVELgOC2hY/exec?action="

// update the exchange rate data once every 2 hours
const updateExchangeRate = () => { 
    // console.log("EXCHANGE RATE UPDATED")
    const sql = "UPDATE Currency SET ExchangeRate = ? WHERE code = ?"
    const connection = mysql.createConnection(dbconfig);
    axios.get(googleSheetApiURL + "getExchangeRate")
    .then(response =>{
        Object.keys(response.data).forEach(key => {
            connection.query(sql, [response.data[key]['value'], key], (error, result)=>{
                if(error){
                    console.log(error);
                }
            })
        });
    })
    .catch(error =>{
        console.log("error happened when updating exhchange rate")
        // console.log(error);
    })
    .finally(() => connection.end());
}
updateExchangeRate();
setInterval(updateExchangeRate, 20 * 60 * 1000);

const getExchangeRate = (req, res) => {
    const connection = mysql.createConnection(dbconfig);
    const sql = "SELECT code, name, ExchangeRate FROM Currency";
    connection.query(sql, [], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const getCurTRRecord = (req, res) => {
    const data = req.query;
    const sql = "SELECT * FROM CurTRRecord WHERE user_id = ?;";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.user_id], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const query = async (connection, sql, values) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, result) => {
            if(error){
                console.log(error);
                reject(500);
            }
            resolve(result);
        })
    })
}

const getCurTRRecordSum = (req, res) => {
    const data = req.query;    
    const sql1 = "SELECT buy_bank_id, SUM(buy_amount) total_buy, sum(charge) charge FROM CurTRRecord WHERE user_id = ? GROUP BY buy_bank_id;"
    const sql2 = "SELECT sell_bank_id, SUM(sell_amount) total_sell FROM CurTRRecord WHERE user_id = ? GROUP BY sell_bank_id;"
    const connection = mysql.createConnection(dbconfig);
    const values = [data.user_id];
    let final_result = {
        buy: {},
        sell: {},
        charge: {}
    };
    query(connection, sql1, values)
    .then(result => {
        console.log(result);
        result.forEach((record) => {
            final_result['buy'][record.buy_bank_id] = record.total_buy;
            final_result['charge'][record.buy_bank_id] = record.charge;
        })
        return query(connection, sql2, values);
    })
    .then(result => {
        console.log(result);
        result.forEach(record => {
            final_result['sell'][record.sell_bank_id] = record.total_sell;
        })
        console.log(final_result);
        res.json(final_result);
    })
    .catch(() => {
        return res.sendStatus(500);
    })
    .finally(() => {
        connection.end();
    })



}

const addCurTRRecord = (req, res) => {
    const data = req.body;
    const sql = "INSERT INTO CurTRRecord (user_id, date, buy_bank_id, sell_bank_id, buy_amount, sell_amount, ExchangeRate, charge) VALUES (?, ?, ?, ?, ?, ?, ?, ?);"
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.user_id, data.date, data.buyBank, data.sellBank, data.buyAmount, data.sellAmount, data.exchangeRate, data.charge], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}

const modifyCurTRRecord = (req, res) => {
    const data = req.body;
    const sql = "UPDATE CurTRRecord SET date = ?, buy_bank_id = ?, sell_bank_id = ?, buy_amount = ?, sell_amount = ?, ExchangeRate = ?, charge = ? WHERE ID = ?;";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.date, data.buyBank, data.sellBank, data.buyAmount, data.sellAmount, data.exchangeRate, data.charge, data.ID], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}

const deleteCurTRRecord = (req, res) => {
    const data = req.query;
    const sql = "DELETE FROM CurTRRecord WHERE ID = ?;";
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

const getUserCurrency = (req, res) => {
    const data = req.query;
    const connection = mysql.createConnection(dbconfig);
    const sql  ='SELECT Cur.name, Cur.code FROM Currency Cur JOIN UserCurrencyList ON Cur.code = UserCurrencyList.code WHERE user_id = ?';
    connection.query(sql, [data.user_id], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.send(result);
    })
    connection.end();
}

const addUserCurrency = (req, res) => {
    const data = req.body;
    const connection = mysql.createConnection(dbconfig);
    const sql = 'INSERT INTO UserCurrencyList (user_id, code) VALUES (?, ?);';
    connection.query(sql, [data.user_id, data.code], (error, result) =>{
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({isSuccess: 1});
    })
    connection.end();
}

const deleteUserCurrency = (req, res) =>{
    const data = req.query;
    const connection = mysql.createConnection(dbconfig);
    const sql = 'DELETE FROM UserCurrencyList WHERE user_id = ? AND code = ?';
    connection.query(sql, [data.user_id, data.code], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatusq(500);
        }
        res.json({isSuccess: 1});
    })
    connection.end();
}

module.exports = {
    getExchangeRate,
    getCurTRRecord,
    getCurTRRecordSum,
    addCurTRRecord,
    modifyCurTRRecord,
    deleteCurTRRecord,
    getUserCurrency,
    addUserCurrency,
    deleteUserCurrency
}