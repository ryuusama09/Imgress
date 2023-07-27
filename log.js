const connectionHelper = require('./mysqlHelper')
const mysqlQuery = require('./sql')

const updateLogs = async(engineID ,logentry)=>{
  const timeStamp =  require('./lamda_1/node_modules/moment')().format('YYYY-MM-DD HH:mm:ss');
  const sql = 'insert into logging(engineID , entry , logtime ) values(? , ? , ?)'
  const values = [engineID , logentry , timeStamp]
  await mysqlQuery(connectionHelper, sql , values).then((response)=>{
    return response;
  })
} 
module.exports = updateLogs;
