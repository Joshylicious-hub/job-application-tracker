const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
})

async function connectDB() {
    
    try {

        const connection = await db.getConnection();
        console.log(`Connected to ${process.env.DB_DATABASE}`);
        connection.release();

    }catch(err) {
        console.error(`Database error: ${err.message}`);
    }

}

connectDB();

module.exports = db;