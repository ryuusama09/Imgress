
import connectionHelper  from '../mysqlHelper.js';
import mysqlQuery from '../sql.js';

const getFetchedLink = async function (imageID){
const connection = connectionHelper;
connection.config.database = 'imgdb'
const sql = `select * from imageData where imageID = '${imageID}'`
     return mysqlQuery(connection , sql)
}
export default  getFetchedLink