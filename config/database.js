const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'testers',
  database: 'Agame',
});

module.exports = pool.promise();