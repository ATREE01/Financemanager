require('dotenv').config();
const allowedOrigins = require('./config/allowedOrigins')
const express = require('express');
const app = express();
const cors = require('cors');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require("./middleware/credentials")

const PORT = process.env.PORT || 5000;

const mysql = require('mysql')

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
app.use(cookieParser());

app.use('/api/Test', require("./routes/Test"));
app.use('/api/auth', require("./routes/Auth"));
app.use('/api/Refresh', require('./routes/Refresh'));

app.use(verifyJWT);

app.use('/api/IncExp', require("./routes/IncExp"));
app.use('/api/Bank', require("./routes/Bank"))

app.listen(PORT, () => console.log(`API is listening on port: ${PORT}`))