const mysql = require("./lamda_1/node_modules/mysql");
const mysqlQuery = require("./sql");
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

const updateLogs = async (engineID, logentry) => {
  const timeStamp = require("./lamda_1/node_modules/moment")().format(
    "YYYY-MM-DD HH:mm:ss"
  );
  const sql ="insert into logging(engineID , entry , logtime ) values(? , ? , ?)";
  const values = [engineID, logentry, timeStamp];
  let obj;
  await mysqlQuery(connectionHelper, sql, values).then((response) => {
   obj = response
  });
  return obj
};

module.exports = updateLogs;
