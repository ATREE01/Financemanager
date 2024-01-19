require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const allowedOrigins = require('./config/allowedOrigins')
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require("./middleware/credentials")

app.use(credentials);
app.use(
    cors({
        origin:[allowedOrigins],
        credentials: true,
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/api/Test', require("./routes/Test"));
app.use('/api/auth', require("./routes/Auth"));
app.use('/api/Refresh', require('./routes/Refresh'));

app.use(verifyJWT);

app.use('/api/IncExp', require("./routes/IncExp"));
app.use('/api/Bank', require("./routes/Bank"));
app.use('/api/Currency', require("./routes/Currency"))

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
