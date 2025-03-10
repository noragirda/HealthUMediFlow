const mysql = require('mysql2');
const dotenv = require('dotenv');
import { QueryError } from 'mysql2'; // Import QueryError from mysql2

// Load environment variables
dotenv.config({ path: '../.env' });

// Create the MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306, // Parse port as an integer
});
// Connect to the database
connection.connect((err: QueryError | null) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        process.exit(1); // Exit the application if the connection fails
    } else {
        console.log('Connected to the MySQL database');
    }
});

module.exports = connection;
