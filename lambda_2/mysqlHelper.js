const mysql = require("mysql");
require("dotenv").config();
const connectionHelper = mysql.createConnection({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT), // default TiDB port is 4000
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "DataDb",
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT), // default TiDB port is 4000
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: "imgdb",
  ssl: {
    minVersion: "TLSv1.2",
    rejectUnauthorized: true,
  },
});

module.exports = { connectionHelper, connection };
