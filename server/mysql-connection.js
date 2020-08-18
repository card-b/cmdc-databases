const mysql = require('mysql');

const {
    HOST,
    MYSQL_USER,
    MYSQL_PASS
} = process.env;

//not bothering with a pool, just get the connection and quit out
function query(query, args) {
    return new Promise((resolve, reject) => {
        const connection = mysql.createConnection({
            host: HOST,
            user: MYSQL_USER,
            password: MYSQL_PASS,
            database: 'teaching'
        });

        connection.query(query, args, (err, results) => {
            if (err) reject(err);
            else resolve(results);
            connection.end();
        });
    });
}

module.exports = {
    query
}