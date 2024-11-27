require('dotenv').config(); // Load environment variables
const mysql = require('mysql2/promise'); // Use the promise wrapper

// Create the connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
if (pool) {
    console.log('Database connected');
}
module.exports = pool;
