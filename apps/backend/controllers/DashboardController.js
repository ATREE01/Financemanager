const dbconfig = require("../config/dbconfig");
const mysql = require('mysql');
const moment = require('moment-timezone');
const cron = require('node-cron');


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

const updateStockMarketValue = () => {
    const userSQL = "SELECT user_id FROM Users;"
    const dataSQL = "\
        SELECT\
            SUM(value) AS market_value\
        FROM(\
            SELECT\
            ROUND(SUM(CASE WHEN SR.action = 'buy' THEN SR.share_number WHEN SR.action = 'sell' THEN -SR.share_number ELSE 0 END) * SP.stock_price * C.ExchangeRate) AS value\
            FROM StockRecord SR\
            LEFT JOIN StockPrice SP ON SR.stock_symbol = SP.stock_symbol\
            LEFT JOIN StockList SL ON SR.stock_symbol = SL.stock_symbol\
            LEFT JOIN Currency C ON SL.currency = C.code\
            WHERE SR.user_id = ?\
            GROUP BY SR.stock_symbol\
        ) AS subquery\
   "
   const recordSQL = " INSERT INTO MarketValueRecord (user_id, date, value) VALUES (?, ?, ?) "
    const connection = mysql.createConnection(dbconfig);
    let userList;
    const date = moment.tz('Asia/Taipei').format('YYYY-MM-DD');
    query(connection, userSQL, [])
    .then(async result => {
        for (const element of result) {
            try {
                const valueResult = await query(connection, dataSQL, [element.user_id]);
                await query(connection, recordSQL, [element.user_id, date, valueResult[0].market_value]);
            } catch (error) {
                console.error(error);
            }
        }
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        connection.end();
    })
}
cron.schedule('0 22 * * 6', () => {
    updateStockMarketValue()
}, {
    timezone: "Asia/Taipei"
});

const getBankAreaChartData = async (req, res) => {
    const data = req.query;
    // incexp record with finance method
    const sql0 = "\
        SELECT SUM(cur_sum) AS initSum\
        FROM (\
            SELECT SUM(B.initialAmount) * C.ExchangeRate AS cur_sum\
            FROM Bank B\
            LEFT JOIN Currency C ON C.code = B.currency\
            WHERE user_id = ?\
            GROUP BY B.currency\
        ) AS subquery;\
    ";
    const sql1 = "\
        SELECT\
            YEAR(date) Y,\
            WEEK(date) W,\
            ROUND(final_amount) AS final_amount\
        FROM (\
            SELECT\
                IER.date,\
                SUM(\
                CASE\
                    WHEN IER.type = 'income' THEN\
                        (IER.amount - IER.charge) * Currency.ExchangeRate\
                    WHEN IER.type = 'expenditure' THEN\
                        -(IER.amount + IER.charge) * Currency.ExchangeRate\
                    ELSE 0\
                END\
                )AS final_amount\
            FROM IncExpRecord IER\
            LEFT JOIN Currency ON IER.currency = Currency.code\
            WHERE IER.user_id = ? AND IER.method <> 'cash'\
            GROUP BY YEAR(IER.date), WEEK(IER.date)\
        ) AS subquery;";

    const sql2 = "\
        SELECT\
        YEAR(date) Y, WEEK(date) W,\
        SUM(ROUND(final_amount)) AS final_amount\
        FROM (\
            SELECT\
            br.date,\
            br.bank_id,\
            (B.initialAmount * C.ExchangeRate) + SUM(\
                CASE WHEN br.type IN ('transfer_in', 'deposit') THEN (br.amount - br.charge) * C.ExchangeRate\
                WHEN br.type IN ('withdraw', 'transfer_out') THEN -(br.amount + br.charge) * C.ExchangeRate\
                ELSE 0 END\
            ) AS final_amount,\
            br.currency\
            FROM BankRecord br\
            LEFT JOIN Currency C ON br.currency = C.code\
            LEFT JOIN Bank B ON br.bank_id = B.bank_id\
            WHERE br.user_id = ?\
            GROUP BY bank_id, YEAR(br.date), WEEK(br.date)\
        ) AS subquery\
        GROUP BY YEAR(date), WEEK(date);\
    ";
    const sql3 = "\
        SELECT\
        YEAR(date) Y,\
        WEEK(date) W,\
        ROUND(final_amount) AS final_amount\
        FROM (\
            SELECT\
            date,\
            SUM(CASE WHEN action = 'buy' THEN -total WHEN action = 'sell' THEN total ELSE 0 END) AS final_amount\
            FROM StockRecord\
            WHERE user_id = ?\
            GROUP BY YEAR(date), WEEK(date)\
        ) AS subquery\
        GROUP BY YEAR(date), WEEK(date);\
    ";
    const sql4 = "\
        SELECT\
        YEAR(date) Y, week(date) W,\
        ROUND(final_amount) AS final_amount\
        FROM (\
            SELECT\
            DR.date,\
            SUM(DR.amount * C.ExchangeRate) AS final_amount\
            FROM DividendRecord DR\
            LEFT JOIN Currency C ON currency = C.code\
            WHERE user_id = ?\
            GROUP BY YEAR(DR.date), WEEK(DR.date)\
        ) AS subquery;\
    ";

    const connection = mysql.createConnection(dbconfig)
    const query = (sql) => {
        return new Promise((resolve, reject) => {
            connection.query(sql, [data.user_id], (error, result) => {
                if(error){
                    console.log(error);
                    reject(500);
                }
                resolve(result);
            })
        })
    }
    
    let tempResult = {};
    let minY = 10000, minW;

    const checkExist = (Y, W) => {
        if(!tempResult[Y])
            tempResult[Y] = {}
        if(!tempResult[Y][W])
            tempResult[Y][W] = 0;
    }

    const getMin = (Y, W) => {
        if(Y < minY){
            minY = Y, minW = W;
        }
        else if(Y == minY){
            minW = Math.min(W, minW);
        }
    }
    let sum = 0;
    await query(sql0)
    .then(result => {
        sum = result[0].initSum;
        return query(sql1);
    })
    .then(result => {
        result.forEach(element => {
            getMin(element.Y, element.W);
            checkExist(element.Y, element.W);
            tempResult[element.Y][element.W] += element.final_amount;
        })
        return query(sql2);
    })
    .then(result => {
        result.forEach(element => {
            getMin(element.Y, element.W);
            checkExist(element.Y, element.W);
            tempResult[element.Y][element.W] += element.final_amount;
        })
        return query(sql3);
    })
    .then(result => {
        result.forEach(element => {
            getMin(element.Y, element.W);
            checkExist(element.Y, element.W);
            tempResult[element.Y][element.W] += element.final_amount;
        })
        return query(sql4);
    })
    .then(result => {
        result.forEach(element => {
            getMin(element.Y, element.W);
            checkExist(element.Y, element.W);
            tempResult[element.Y][element.W] += element.final_amount;
        })
    })
    .catch(error => {
        console.log(error);
        return res.sendStatus(500);
    })
    .finally(() => {
        connection.end();
    })
    const startDate = moment().year(minY).week(minW).endOf('week');
    const endDate = moment();
    const currentDate = moment(startDate)
    const currentYear = endDate.year();
    const currentWeek = endDate.week() - 1;
    const bankAreaChartData = [['date', '資產']];

    for(let i = minY;  i <= currentYear; i++){
        for(let j = (i === minY ? minW : 0); j <= (i === currentYear ? currentWeek - 1 : 52); j++){    
            sum += tempResult[i][j] ?? 0;    
            bankAreaChartData.push([currentDate.endOf("week").format("YYYY-MM-DD"), sum])
            currentDate.add(1, 'week')
        }
    }   
            
    if(bankAreaChartData.length === 1)
        bankAreaChartData.push([moment().tz('America/New_York').format("YYYY-MM-DD"), 0]);
    res.send(bankAreaChartData)
}

const getBankData = (req, res) => {
    const data = req.query;        
    const sql0 = "\
        SELECT B.bank_id, SUM(B.initialAmount) * C.ExchangeRate AS initialAmount\
        FROM Bank B\
        LEFT JOIN Currency C ON C.code = B.currency\
        WHERE user_id = ?\
        GROUP BY B.bank_id\
    ";
    const sql1 = "\
        SELECT\
            bank_id,\
            net_amount * ExchangeRate AS final_amount\
        FROM (\
            SELECT\
                IER.bank_id,\
                SUM(CASE WHEN IER.type = 'income' THEN IER.amount - IER.charge\
                        WHEN IER.type = 'expenditure' THEN -(IER.amount + IER.charge)\
                        ELSE 0 END) AS net_amount,\
                IER.currency\
            FROM IncExpRecord IER\
            WHERE user_id = ? AND IER.method <> 'cash'\
            GROUP BY IER.bank_id\
        ) AS subquery\
        LEFT JOIN Currency ON subquery.currency = Currency.code;\
    ";
    const sql2 = "\
        SELECT\
            subquery.bank_id,\
            (B.initialAmount + subquery.net_amount) * Currency.ExchangeRate AS final_amount\
        FROM (\
            SELECT\
                br.bank_id,\
                SUM(CASE WHEN br.type IN ('transfer_in', 'deposit') THEN (br.amount - br.charge)\
                        WHEN br.type IN ('withdraw', 'transfer_out') THEN -(br.amount + br.charge)\
                        ELSE 0 END) AS net_amount,\
                br.currency\
            FROM BankRecord br\
            WHERE user_id = ?\
            GROUP BY br.bank_id, br.currency\
        ) AS subquery\
        LEFT JOIN Currency ON subquery.currency = Currency.code\
        LEFT JOIN Bank B ON subquery.bank_id = B.bank_id;\
    ";
    const sql3 = "\
        SELECT\
        bank_id,\
        SUM(CASE WHEN action = 'sell' THEN total ELSE 0 END) - SUM(CASE WHEN action = 'buy' THEN total ELSE 0 END) AS amount\
        FROM StockRecord\
        WHERE user_id = ?\
        GROUP BY bank_id;\
    ";
    const sql4 = "\
        SELECT bank_id,\
        net_amount * ExchangeRate AS final_amount\
        FROM (\
            SELECT\
                DR.bank_id,\
                SUM(DR.amount) AS net_amount,\
                DR.currency\
            FROM DividendRecord DR\
            WHERE user_id = ?\
            GROUP BY DR.bank_id, DR.currency\
        ) AS subquery\
        LEFT JOIN Currency ON subquery.currency = Currency.code;\
    ";

    const connection = mysql.createConnection(dbconfig)
    let bankData = {};
    query(connection, sql0, [data.user_id])
    .then(result => {
        result.forEach(element => {
            bankData[element.bank_id] = element.initialAmount;
        })
        return query(connection, sql1, [data.user_id])
    })
    .then((result) => {
        result.forEach(element => {
            bankData[element.bank_id] += element.final_amount;
        })
        return query(connection, sql2, [data.user_id]);
    })
    .then((result) => {
        result.forEach(element => {
            bankData[element.bank_id] += element.final_amount;
        });
        return query(connection, sql3, [data.user_id]);
    })
    .then((result) => {
        result.forEach(element => {
            bankData[element.bank_id] += element.amount;
        });
        return query(connection, sql4, [data.user_id]);
    })
    .then((result) => {
        result.forEach(element => {
            bankData[element.bank_id] += element.final_amount;
        });
        res.json(bankData);
    })
    .catch((error) => {
        console.log(error);
        res.sendStatus(500);
    })
    .finally(() => {
        connection.end();
    })
}

const getInvtAreaChartData = (req, res) => {
    const data = req.query;
    const sql = "\
        SELECT\
            date,\
            value\
        FROM MarketValueRecord\
        WHERE user_id = ?\
    "
    const connection = mysql.createConnection(dbconfig);
    const invtAreaChartData = [['date', '市值']];
    connection.query(sql, [data.user_id], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        
        if(result.length === 0)
            invtAreaChartData.push([moment().tz('America/New_York').format("YYYY-MM-DD"), 0]);
        result.forEach(element => {
            invtAreaChartData.push([element.date, element.value]);
        })

        res.send(invtAreaChartData);
    })
    connection.end();
}

const getInvtData = (req, res) => {
    const data = req.query;
    const sql = "\
        SELECT\
            B.brokerage_id,\
            ROUND(\
                SUM(\
                    CASE \
                        WHEN SR.action = 'buy' THEN SR.share_number \
                        WHEN SR.action = 'sell' THEN -SR.share_number\
                        ELSE 0\
                    END\
                    * SP.stock_price * C.ExchangeRate\
                )\
            )AS total_amount\
        FROM  Brokerage B\
        LEFT JOIN StockRecord SR ON SR.brokerage_id = B.Brokerage_id\
        LEFT JOIN StockPrice SP ON SP.stock_symbol = SR.stock_symbol\
        LEFT JOIN Currency C ON C.code = B.transactionCur\
        WHERE B.user_id = ?\
        GROUP BY B.brokerage_id;\
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

module.exports = {
    getBankAreaChartData,
    getBankData,
    getInvtAreaChartData,
    getInvtData
}