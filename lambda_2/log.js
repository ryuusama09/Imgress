const { connectionHelper } = require("./mysqlHelper");
const mysqlQuery = require("./sql");

const updateLogs = async (engineID, logentry) => {
  const timeStamp = require("moment")().format("YYYY-MM-DD HH:mm:ss");
  console.log(timeStamp, require("moment")());
  const sql =
    "insert into logging(engineID , entry , logtime ) values(? , ? , CONVERT_TZ (?, '+00:00', '+05:30'))";
  const values = [engineID, logentry, timeStamp];
  let obj;
  await mysqlQuery(connectionHelper, sql, values).then((response) => {
    obj = response;
  });
  return obj;
};

module.exports = updateLogs;
