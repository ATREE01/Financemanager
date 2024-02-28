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
    const data = req.body;
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
    getUserCurrency,
    addUserCurrency,
    deleteUserCurrency
}