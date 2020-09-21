const mysql = require('mysql');
const dotenv = require('dotenv');
dotenv.config();

    let connection;
    module.exports = {

    myConn: function () {
        connection = mysql.createConnection({
            host: process.env.HOST,
            user: process.env.USERNAME,
            password: process.env.PASSWORD,
            database: process.env.DATABASE,
            port: process.env.DB_PORT
        });
        connection.connect();
        return connection;
    }
};