const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql')

const dbconfig = require('../config/dbconfig.js');


const Register = (req, res) =>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password_hash = bcrypt.hashSync(password, 10);
    const connection = mysql.createConnection(dbconfig);
    const sql = "INSERT INTO Users (username, email, password_hash) VALUES (?, ?, ?)";
    connection.query(sql, [username, email, password_hash], function(error, result){
        if(error){
            if(error.errno === 1062){
                res.json({
                    success : 0,
                    errno: error.errno
                });
            }
            else
                console.log(error);
        }
        else {
            res.json({
                success : 1,
            })
        }
    });
    connection.end();
}

const Login = (req, res) =>{
    const email = req.body.email;
    const password = req.body.password;
    
    const connection = mysql.createConnection(dbconfig);
    const query = 'select * from Users WHERE email = ?';
    connection.query(query, [email], (err, results) => {
        if(err){
            console.log(err);
            res.sendStatus(500);
        }
        else if(results.length !== 0){
            const user = Object.assign({}, results[0]);
            if(bcrypt.compareSync(password, user.password_hash)){
                const accessToken = jwt.sign({"username" : user.username, "email" : user.email}, process.env.ACCESS_TOKEN_SECRET, {
                    expiresIn: '60s'
                });
                const refreshToken = jwt.sign({"username" : user.username, "email" : user.email}, process.env.REFRESH_TOKEN_SECRET, {
                    expiresIn: '2h'
                });
                res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
                res.json({ user_id:user.user_id, username:user.username, email:user.email, accessToken: accessToken })
            }
        }
        else {
            res.sendStatus(404);
        }
    });
    connection.end();
}

const Logout = async (req, res) =>{
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
    res.sendStatus(204);
}

module.exports = {
    Register,
    Login,
    Logout
}