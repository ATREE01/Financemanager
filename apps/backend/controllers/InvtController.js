const axios = require('axios');
const mysql = require("mysql");
const uuid4 = require("uuid4");
const dbconfig = require('../config/dbconfig');

const googleSheetApiURL = "https://script.google.com/macros/s/AKfycbzwK-fuvMUuqx5uuBSF_RWsjVLK-B0k6bZKn1R8AB3kYrLME2kLsMxTVPVELgOC2hY/exec?action="

const addStockSymbol = async (stockSymbol) => {
    const sql = "INSERT INTO StockPrice (stock_symbol, stock_price) VALUES (?, 0);"
    const connection = mysql.createConnection(dbconfig);

    // Add to google sheet
    const data = {"stockSymbol": stockSymbol}
    let currency;
    await axios.post(googleSheetApiURL + "addStockSymbol", data)
    .then(response => {
        const data = response.data;
        currency = data.currency
        if(data.success !== 1){
            throw new Error("");
        }
        else {
            connection.query(sql, [stockSymbol], (error, result) => {
                if(error){
                    if(error.errno !== 1062){
                        console.log(error);
                        throw new Error("");
                    }
                }
            });
        }
        updateStockPrice();
    })
    .catch((error) => {
        console.log(error);
        return {success: false};
    });
    return {success: true, currency: currency};
}

const updateStockPrice = () => {
    console.log("Stock Price Updated");
    const sql = "UPDATE StockPrice SET stock_price = ? WHERE stock_symbol = ?";
    const connection = mysql.createConnection(dbconfig);
    axios.get(googleSheetApiURL + "getStockPrice")
    .then(response => {
        Object.keys(response.data).forEach(key => {
            connection.query(sql, [response.data[key], key], (error, result)=>{
                if(error){
                    console.log(error);
                }
            })
        });
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => connection.end());
}
setInterval(updateStockPrice, 20 * 60 * 1000);

const getBrokerage = (req, res) => {
    const data = req.query;
    const sql = "SELECT brokerage_id, name, transactionCur, settlementCur FROM Brokerage WHERE user_id = ?  ORDER BY ID;";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [ data.user_id ], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const addBrokerage = (req, res) => {
    const data = req.body;
    const brokerage_id = uuid4();
    const sql = "INSERT INTO Brokerage (user_id, brokerage_id, name, transactionCur, settlementCur) VALUES (?, ?, ?, ?, ?);";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.user_id, brokerage_id, data.name, data.transactionCur, data.settlementCur], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success : 1});
    })
    connection.end();
}

const getStock = (req, res) => {
    const data = req.query;
    const sql = "SELECT stock_symbol, stock_name FROM StockList WHERE user_id = ? ORDER BY ID;";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [ data.user_id ], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const getStockPrice = (req, res) => {
    const data = req.query;
    const sql = "\
        SELECT\
        SL.stock_symbol,\
        SP.stock_price\
        FROM\
        StockList SL\
        JOIN\
        StockPrice SP ON SL.stock_symbol = SP.stock_symbol\
        WHERE\
        SL.user_id = ?;\
    ";
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

const addStock = async (req, res) => {
    const data = req.body;
    
    // This is function to add stock sumbol to google sheet and sql StockTable
    const result = await addStockSymbol(data.stock_symbol)
    if(result.success === false){
        return res.sendStatus(500);
    }
    
    const sql = "INSERT INTO StockList (user_id, stock_symbol, currency, stock_name) VALUES (?, ?, ?, ?);";
    const connection = mysql.createConnection(dbconfig);
    console.log(result.currency);
    connection.query(sql, [data.user_id, data.stock_symbol, result.currency, data.stock_name], (error, result) => {
        if(error){
            if(error.errno === 1062)
                res.json({errno: 1062, text:"此代號及名稱已新增過!"});
            else {
                console.log(error);
                return res.sendStatus(500);
            }
        }
        else {
            res.json({success: 1});
        }
    })
    connection.end();
}

const getStockRecord = (req, res) => {
    const data = req.query;
    const values = [ data.user_id ];
    let sql = "SELECT ID, user_id, brokerage_id, date, action, type, bank_id, stock_symbol, total, buy_stock_price, sell_stock_price, share_number, buy_exchange_rate, charge, tax, note \
            FROM StockRecord WHERE user_id = ? ";
    if(data.stock_symbol !== 'ALL'){
        sql += "AND stock_symbol = ?"
        values.push(data.stock_symbol);
    }
    sql += "ORDER BY DATE DESC;";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, values, (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const getStockRecordSum = (req, res) => {
    const data = req.query;
    let sql = "\
        SELECT\
            B.brokerage_id, B.stock_symbol,\
            SUM(B.share_number - COALESCE(S.share_number, 0)) AS hold_share_number,\
            SUM((B.share_number - COALESCE(S.share_number, 0)) * B.buy_stock_price - COALESCE(S.charge, 0)) AS hold_transaction_cost,\
            SUM(B.total - COALESCE((S.buy_stock_price * S.share_number + B.charge * S.share_number / B.share_number) * B.buy_exchange_rate, 0)) AS hold_settlement_cost,\
            SUM(S.buy_stock_price * S.share_number + S.charge) AS sold_transaction_cost,\
            SUM(S.buy_stock_price * S.share_number + S.charge) * B.buy_exchange_rate AS sold_settlement_cost,\
            SUM((S.sell_stock_price * S.sell_exchange_rate - B.buy_stock_price * B.buy_exchange_rate) * S.share_number) - (B.charge * B.buy_exchange_rate) - (S.charge + S.tax) * S.sell_exchange_rate AS realized\
        FROM\
            StockRecord B\
        LEFT JOIN\
            StockRecord S ON\
            B.user_id = S.user_id\
            AND B.brokerage_id = S.brokerage_id\
            AND B.stock_symbol = S.stock_symbol\
            AND B.buy_exchange_rate = S.buy_exchange_rate\
            AND B.action = 'buy'\
            AND S.action = 'sell'\
            AND B.buy_stock_price = S.buy_stock_price\
        WHERE B.user_id = ? AND B.action = 'buy'\
    ";
    let values = [ data.user_id ]
    if(data.brokerage !== 'ALL'){
        sql += " AND B.brokerage_id = ?"
        values.push(data.brokerage);
    }
    sql += "\
        GROUP BY B.brokerage_id, B.stock_symbol\
        ORDER BY B.ID;"; 
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, values, (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();

}

const getStkRecPriceSum = (req, res) => {
    const data = req.query;
    let sql ="\
        SELECT\
            B.brokerage_id, B.bank_id, B.stock_symbol, B.buy_stock_price, B.buy_exchange_rate,\
            B.share_number - COALESCE(S.share_number, 0) AS hold_share_number,\
            B.total - COALESCE((S.buy_stock_price * S.share_number + B.charge * S.share_number / B.share_number) * B.buy_exchange_rate, 0) AS hold_cost,\
            (S.sell_stock_price * S.sell_exchange_rate - B.buy_stock_price * B.buy_exchange_rate) * S.share_number - (B.charge * B.buy_exchange_rate) - (S.charge + S.tax) * S.sell_exchange_rate AS realized\
        FROM\
            StockRecord B\
        LEFT JOIN\
            StockRecord S ON\
            B.user_id = S.user_id\
            AND B.brokerage_id = S.brokerage_id\
            AND B.stock_symbol = S.stock_symbol\
            AND B.buy_exchange_rate = S.buy_exchange_rate\
            AND B.action = 'buy'\
            AND S.action = 'sell'\
            AND B.buy_stock_price = S.buy_stock_price\
        WHERE B.user_id = ? AND B.action = 'buy'\
    ";
    const values = [ data.user_id ]
    if(data.brokerage !== 'ALL'){
        sql += " AND B.brokerage_id = ?"
        values.push(data.brokerage);
    }
    sql += " ORDER BY hold_share_number DESC, B.buy_stock_price DESC ;";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, values, (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const addStockRecord = (req, res) => {
    const data = req.body;
    const sql = "INSERT INTO StockRecord (user_id, brokerage_id, date, action, type, bank_id, total, stock_symbol, buy_stock_price, sell_stock_price, share_number, buy_exchange_rate, sell_exchange_rate, charge, tax, note) \
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.user_id, data.brokerage, data.date, data.action, data.type, data.bank, data.total, data.stock_symbol, data.buy_stock_price, data.sell_stock_price, data.share_number, data.buy_exchange_rate, data.sell_exchange_rate, data.charge, data.tax, data.note], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}

const modifyStockRecord = (req, res) => {
    const data = req.query;
    const sql = "UPDATE StockRecord SET brokerage_id = ?, date = ?, action = ?, type = ?, bank_id = ?\
    total = ?, stock_symbol = ?, buy_stock_price = ?, sell_stock_price = ?, share_number = ?, exchange_rate = ?, charge = ?, note = ? WHERE ID = ?;";
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.brokerage, data.date, data.action, data.type, data.bank, data.total, data.stock_symbol, data.buy_stock_price, data.sell_stock_price, data.share_number, data.charge, data.exchange_rate, data.note, data.ID], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}

const deleteStockRecord = (req, res) => {
    const data = req.query;
    const sql = "DELETE FROM StockRecord WHERE ID = ?";
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

const getDividendRecord = (req, res) => {
    const data = req.query;
    const sql = "SELECT ID, date, brokerage_id, stock_symbol, bank_id, currency, amount FROM DividendRecord WHERE user_id = ?";
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

const getDividendRecordSum = (req, res) => {
    const data = req.query;
    const sql = "SELECT brokerage_id, stock_symbol, bank_id, currency, sum(amount) AS amount FROM DividendRecord WHERE user_id = ? GROUP BY brokerage_id, stock_symbol;"
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

const addDividendRecord = (req, res) => {
    const data = req.body;
    const sql = "INSERT INTO DividendRecord (user_id, date, brokerage_id, stock_symbol, bank_id, currency, amount) VALUES (?, ?, ?, ?, ?, ?, ?);"
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.user_id, data.date, data.brokerage, data.stock_symbol, data.bank, data.bankCurrency, data.amount], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}

const modifyDividendRecord = (req, res) => {
    const data = req.query;
    const sql = "UPDATE DividendRecord SET date = ?, brokerage_id = ?, stock_symbol = ?, bank_id = ?, amount = ? WHERE ID = ?;"
    const connection = mysql.createConnection(dbconfig);
    connection.query(sql, [data.date, data.brokerage, data.stock_symbol, data.bank, data.amount, data.ID], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json({success: 1});
    })
    connection.end();
}

const deleteDividendRecord = (req, res) => {
    const data = req.query;
    const sql = "DELETE FROM DividendRecord WHERE ID = ?";
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

const getInvtRecordSum = (req, res) => {
    const data = req.query;
    const user_id = data.user_id;
    const sql1 = "\
        SELECT\
        bank_id,\
        SUM(CASE WHEN action = 'sell' THEN total ELSE 0 END) - SUM(CASE WHEN action = 'buy' THEN total ELSE 0 END) AS amount\
        FROM StockRecord\
        WHERE user_id = ?\
        GROUP BY bank_id;\
    ";
    const connection = mysql.createConnection(dbconfig);
    const query = (sql) => {
        return new Promise(async (resolve, reject) => {
            connection.query(sql, [user_id], (error, result) => {
                if(error){
                    console.log(error);
                    reject(500);
                }else {
                    resolve(result);
                }
            });
        });
    };
    const recordSum = {};
    query(sql1)
    .then((result) => {
        result.forEach(element => {
            recordSum[element.bank_id] =(recordSum[element.bank_id] || 0) + element.amount;
        })
        res.json(recordSum);
    })
    .catch(error => {
        console.log(error);
        res.sendStatus(500);
    })
    .finally(() => {
        connection.end();
    })

}

module.exports = {
    getBrokerage,
    addBrokerage,
    getStock,
    getStockPrice,
    addStock,
    getStockRecord,
    getStockRecordSum,
    getStkRecPriceSum,
    addStockRecord,
    modifyStockRecord,
    deleteStockRecord,
    getDividendRecord,
    getDividendRecordSum,
    addDividendRecord,
    modifyDividendRecord,
    deleteDividendRecord,
    getInvtRecordSum
}
