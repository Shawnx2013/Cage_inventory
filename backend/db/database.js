const mysql = require("mysql2");

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    // connectionLimit: 10, //needed for createPool()
    // waitForConnections: true,
    // queueLimit: 0
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_SCHEMA,
    connectionLimit: 10, //needed for createPool()
    waitForConnections: true,
    queueLimit: 0
})
module.exports = conn;
module.exports = pool;