import connection from "./mysqlHelper.js";
import mysqlQuery from "./sql.js";

const getFetchedLink = async function (imageID) {
  const sql = `select * from imageData where imageID = '${imageID}'`;
  return mysqlQuery(connection.connection, sql);
};
export default getFetchedLink;
