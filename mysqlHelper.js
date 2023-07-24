const mysql = require('./lamda_1/node_modules/mysql')
const connectionHelper = mysql.createConnection({
    host: "gateway01.eu-central-1.prod.aws.tidbcloud.com",
    port: 4000, // default TiDB port is 4000
    user: "3dgtwFUbG2B7Tr1.root",
    password: "3NFEh6DwOFfkQvsz",
    database: "DataDb",
    ssl: {
      minVersion: "TLSv1.2",
      rejectUnauthorized: true,
    },
  });
  module.exports = connectionHelper;