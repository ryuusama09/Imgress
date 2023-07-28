import mysqlQuery from "./sql.js";
import connectionHelper from "./mysqlHelper.js";
import moment from "moment";
const updateLogs = async (engineID, logentry) => {
  const timeStamp = moment().format("YYYY-MM-DD HH:mm:ss");
  console.log(timeStamp, moment());
  const sql =
    "insert into logging(engineID , entry , logtime ) values(? , ? , CONVERT_TZ (?, '+00:00', '+05:30'))";
  const values = [engineID, logentry, timeStamp];
  let obj;
  await mysqlQuery(connectionHelper, sql, values).then((response) => {
    obj = response;
  });
  return obj;
};

export default updateLogs;
