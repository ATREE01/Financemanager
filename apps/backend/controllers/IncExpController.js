const mysql = require('mysql');
const uuid4 = require('uuid4');
const dbconfig = require('../config/dbconfig.js');

const dayMap = {
    'week': 7,
    'month': 30,
    '3month': 90,
    'YTD': 0,
}

const GetIncExpRecord = (req, res) => {
    const connection = mysql.createConnection(dbconfig);
    const data = req.body;
    const user_id = data.user_id
    const duration = data.duration;
    const type = data.type
    const category = data.category;
    const currency = data.currency;
    const method = data.method;
    const bank = data.bank;
    if(data.duration === 'YTD'){
        const now = new Date();
        dayMap[duration] =  (now - new Date(now.getFullYear(), 0, 1)) / 1000 / 60 / 60 / 24;
    }
    let sql = `SELECT * FROM IncExpRecord WHERE user_id = ?`;
    values = [user_id]
    if(duration !== 'default'){sql += ` AND DATEDIFF(CURDATE(), date) <= ${dayMap[duration]}`;}
    if(type !== "default") {sql += " AND type = ?"; values.push(type);}
    if(category !== "default") {sql += " AND category = ?"; values.push(category);}
    if(currency !== "default") {sql += " AND currency = ?"; values.push(currency);}
    if(method !== "default") {sql += " AND method = ?"; values.push(method);}
    if(bank !== "default") {sql += " AND bank_id = ?"; values.push(bank);}
    sql += " ORDER BY date DESC, record_id DESC"
    connection.query(sql, values, (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        res.json(result);
    })
    connection.end();
}

const GetIncExpFinRecordSum = (req, res) => {
    const data = req.body;
    const user_id = data.user_id;
    const sql = `SELECT bank_id, SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END) AS inSum,
                 SUM(CASE WHEN type = 'expenditure' THEN amount ELSE 0 END) AS expSum
                 FROM incExpRecord WHERE user_id = ? AND method = 'finance' OR method = 'credit' GROUP BY bank_id`
    const connection = mysql.createConnection(dbconfig);
    const query = () => {
        return new Promise((resolve, reject) => {
            connection.query(sql, [user_id], (error, result) => {
                if(error){
                    console.log(error);
                    reject(500);
                }
                resolve(result);
            });
        });
    };
    const result_dict = {};
    query() // this equivalent to account  
    .then((result) => {
        result.forEach(element => {
            result_dict[element['bank_id']] = {
                inSum: element['inSum'] = element['inSum'],
                expSum: element['expSum'] = element['expSum'] 
            }
        });
        res.json(result_dict);
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(500);
    })
    .finally(() =>{
        connection.end();
    });
}


const GetIncExpRecordSum = async (req, res)=>{
    const data = req.body;
    const user_id = data.user_id;
    const duration = data.duration;
    if(data.duration === 'YTD'){
        const now = new Date();
        dayMap[duration] = (now - new Date(now.getFullYear(), 0, 1)) / 1000 / 60 / 60 / 24;
    }
    let sql = `SELECT category, SUM(amount) FROM IncExpRecord WHERE user_id = ? AND type = ?`;
    if(duration !== 'default') sql += ` AND DATEDIFF(CURDATE(), date) <= ${dayMap[duration]}`;
    sql += ` GROUP BY category, type`;

    let incSum, expSum;
    const connection = mysql.createConnection(dbconfig);
    const query = async (type) =>{
        return new Promise((resolve, reject) => {
            connection.query(sql, [user_id, type], (error, result) => {
                if(error){
                    console.log(error);
                    reject(500);
                }
                resolve(result);
            })
        })
    };
    query("income")
    .then(result => {
        incSum = result;
        return query("expenditure");
    })
    .then(result => {
        expSum = result;
        res.json({
            incSum: incSum,
            expSum: expSum
        });
    })
    .catch(err => {
        res.sendStatus(500);
    })
    .finally(() => {
        connection.end();
    })
}

const AddIncExpRecord = (req, res) => {
    const connection = mysql.createConnection(dbconfig);
    const sql = "INSERT INTO IncExpRecord (user_id, date, type, category, currency, method, amount, bank_id, charge, note)  \
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    const data = req.body;
    const bank_id = (data.bank === "default" ? "" : data.bank);
    connection.query(sql, [data.user_id, data.date, data.type, data.category, data.currency, data.method, data.amount, bank_id, data.charge, data.note], (error, result) => {
        if(error){
            return res.sendStatus(500);
        }
        else {
            res.json({success: 1});
        }
    });
    connection.end();
}

const  GetIncExpCategory = async (req, res) =>{
    const connection = mysql.createConnection(dbconfig);
    const sql = "SELECT sort, value, name FROM IncExpCategory where user_id = (?) AND type = 'income'"
    const sql2 = "SELECT sort, value, name FROM IncExpCategory where user_id = (?) AND type ='expenditure'"
    const user_id = req.body.user_id;
    let IncomeCategoryData = [...IncomeCategoryDataDefault];
    let ExpenditureCategoryData = [...ExpenditureCategoryDataDefault];
    connection.query(sql, [user_id], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        const IncomeCategory = result.map(item => Object.assign({}, item));
        IncomeCategory.forEach(element => {
            IncomeCategoryData.push({
                value: element.value,
                name: element.name
            })
        });
    })
    connection.query(sql2, [user_id], (error, result) => {
        if(error){
            console.log(error);
            return res.sendStatus(500);
        }
        const ExpenditureCategory = result.map(item => Object.assign({}, item));
        ExpenditureCategory.forEach(element => {
            ExpenditureCategoryData.push({
                value: element.value,
                name: element.name
            })
        });
        res.json({
            IncomeCategoryData: IncomeCategoryData,
            ExpenditureCategoryData: ExpenditureCategoryData
        })
    })
    connection.end();
}

const AddIncExpCategory = (req, res) =>{
    const connection = mysql.createConnection(dbconfig);
    const sql = "INSERT INTO IncExpCategory (user_id, type, value, name) VALUES(?, ?, ?, ?)"//TODO: add the feature that user can sort their category
    const data = req.body;
    IncomeCategoryDataDefault.forEach((element) => {
        if(element.name === data.name){
            res.json({success: 0, text:"This name has been used"});
        }
    })

    ExpenditureCategoryDataDefault.forEach((element) => {
        if(element.name === data.name){
            res.json({success: 0, text:"This name has been used"});
        }
    })
    const value = uuid4();
    connection.query(sql, [data.user_id, data.type, value, data.name], (error, result) => {
        if(error){
            console.log(error);
            if(error.errno === 1062)
                res.json({success: 0, text:"This name has been used"});
        }
        else {
            res.json({success: 1});
        }
    })
}

const IncomeCategoryDataDefault = [
    {
        value:"salary",
        name:"薪水"
    },
    {
        value:"interest",
        name:"利息"
    },
    {
        value:"pocket",
        name:"零用錢"
    },
    {
        value:"given",
        name:"贈與"
    },
    {
        value:"others",
        name:"其他"
    },
]

const ExpenditureCategoryDataDefault = [
    {
        value:"food_bev",
        name:"餐飲"
    },
    {
        value:"transportation",
        name:"交通"
    },
    {
        value:"electricity",
        name:"電費"
    },
    {
        value:"water",
        name:"水費"
    },
    {
        value:"phone",
        name:"電話費"
    },
    {
        value:"fuel",
        name:"燃料費"
    },
    {
        value:"medical",
        name:"醫療"
    },
    {
        value:"education",
        name:"教育"
    },
    {
        value:"electronic",
        name:"電子產品"
    },
    {
        value:"entertainment",
        name:"娛樂"
    },
    {
        value:"exercise",
        name:"運動"
    },
    {
        value:"hair",
        name:"理髮"
    },
    {
        value:"clothing",
        name:"服飾"
    },
    {
        value:"others",
        name:"其他"
    }
]

module.exports = {
    GetIncExpRecord,
    GetIncExpRecordSum,
    GetIncExpFinRecordSum,
    AddIncExpRecord,
    GetIncExpCategory,
    AddIncExpCategory,
}