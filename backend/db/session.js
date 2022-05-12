const session = require('express-session');
const MYSQLStore = require('express-mysql-session')(session);
const mysql = require("mysql2/promise");

const conn = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    connectionLimit: 1,
    waitForConnections: true,
});
const sessionStore = new MYSQLStore({
    checkExpirationInterval: 30000,
    expiration: 900000
}, conn);

module.exports = sessionStore;