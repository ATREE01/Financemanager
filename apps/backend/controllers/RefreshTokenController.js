const jwt = require('jsonwebtoken');
const mysql = require('mysql');

const dbconfig = require('../config/dbconfig.js');

const Refresh = (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err){
                res.sendStatus(403);
            }
            else {
                const connection = mysql.createConnection(dbconfig);
                const query = 'select * from Users WHERE email = ?';
                connection.query(query, [decoded.email], (err, results) => {
                    if(err) {
                        console.log(err);
                        res.sendStatus(500);// server error
                    }
                    else if(results.length === 0)return res.sendStatus(403);
                    else{
                        const user = Object.assign({}, results[0]);
                        if(user.username != decoded.username)return res.sendStatus(403);
                        const accessToken = jwt.sign(
                            {"username": decoded.username, "email": decoded.email}, 
                            process.env.ACCESS_TOKEN_SECRET,
                            {expiresIn: '60s'}
                            );
                            const newRefreshToken = jwt.sign(
                            {"username": decoded.username, "email": decoded.email}, 
                            process.env.REFRESH_TOKEN_SECRET,
                            {expiresIn: '2h'}
                            );
                            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
                            res.json({ user_id:user.user_id, username:decoded.username, email:decoded.email, accessToken: accessToken })
                        }
                });
                connection.end();
            }
        }
    );

}

module.exports = {
    Refresh
}