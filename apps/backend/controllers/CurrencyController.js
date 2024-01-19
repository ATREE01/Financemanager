const axios = require('axios');
const mysql = require('mysql');
const dbconfig = require('../config/dbconfig.js');

const exchangeRateURL = "https://script.google.com/macros/s/AKfycbxxRyZg95jZrVSZSa9En4JURG8h7Ouuwlq39D4GAm9LdNCituNFCBYhas5yTUGm8ayV/exec?action=getExchangeRate"

// update the exchange rate data once every twelve hours
const updateExchangeRate = () => { 
    const sql = "UPDATE Currency SET ExchangeRate = ? WHERE code = ?"
    const connection = mysql.createConnection(dbconfig);
    axios.get(exchangeRateURL)
    .then(response =>{
        Object.keys(response.data).forEach(key => {
            connection.query(sql, [response.data[key]['value'], key], (error, result)=>{
                if(error){
                    console.log(error);
                    return;
                }
            })
        });
    })
    .catch(error =>{
        console.log(error);
    })
    .finally(() => connection.end());
}
setInterval(updateExchangeRate, 43200000);

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