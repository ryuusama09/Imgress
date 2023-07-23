const express = require( "express");
const mysql = require("mysql");
const serverless = require("serverless-http");
const { v4: uuidv4Generator } = require('uuid')
var bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const app = express();
const cors = require('cors')
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors())
const connectionHelper = require('../mysqlHelper') //check this after completing all the functions, refactor the code :(
const PORT = 3003;

if (process.env.ENVIRONMENT === "lambda") {
  module.exports.handler = serverless(app);
} else {
  app.listen(PORT, () => {
    console.log("Hello");
  });
}

const connection = mysql.createConnection({
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


const apiGenerator = function (engineName , engineID){
  const key = engineName+engineID;
  return `http://localhost3005/dev/fetch/${key}`
}
const classGenerator = function(engineName , engineID){
         return engineName+engineID;
}
const createInstance = async function (req, res) {
  const uniqueEngineID = uuidv4Generator();
  const userID = req.body.userID;
  const name = req.body.name;
  const schema = req.body.schema
  console.log(schema)
  const EngineApi = apiGenerator(name , uniqueEngineID);
  const className = classGenerator(name , uniqueEngineID);
  //need to connect the tidb cluster 0
  try{
  const sql = "INSERT INTO EngineData (engineID, userID, apiURL,name,class) VALUES (?, ?, ?,?,?)";
  const values = [uniqueEngineID, userID,EngineApi,name,className];
  const result = await mysqlQuery(connection,sql,values);
   res.status(200).send(result)
  }catch(err){
    res.status(404).json(err);
  } // connection.end();
};
const DeliverData = async function (req, res) {
  try{
  const sql = `SELECT * FROM EngineData WHERE userID = ${req.body.userID} `;
  const result = await mysqlQuery(connection , sql);
  res.status(200).send(result)
  }catch(err){
    res.status(404).json(err);
  }

  // connection.end();
};

// Login route
function mysqlQuery(connection , sql , values){
  if(values === undefined)return new Promise((resolve, reject) => {
    connection.query(sql, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
  else return new Promise((resolve, reject) => {
    connection.query(sql, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });


}
const loginHandler = async  function (req , res){
  //console.log(req)
   try {
    const { email , password } = req.body;
    //console.log(email , password)
    const sql = `SELECT * from userData WHERE email = '${email}' `
    const result = await mysqlQuery(connection, sql)
    if(Object.keys(result).length === 0){
         res.send('no such user email you')
         
    }
    const query = Object.values(result)[0];
    const pass =  Object.values(query)[2];
    const userID = Object.values(query)[3];
    const passwordMatch = await bcrypt.compare(password, pass);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid username or password'  , success : false });
    }
     res.status(200).json({ message: 'Login successful' , success : true ,result });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error bruh', });
  }
};


const signUpHandler = async function (req ,res){
  try {
    const { email , password , username } = req.body;
    console.log(req.body)
    const sql = `SELECT * from userData WHERE email = '${email}' `
    const result = await mysqlQuery(connection, sql) 
    if (Object.keys(result).length > 0) {
      return res.status(409).json({ message: 'Email already exists' });
    }   
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insert = "INSERT INTO userData (email ,username,userPass , UserID) VALUES (?, ?, ? ,?)"
    // Save user to the database
    const userID = uuidv4Generator()
    const values = [email, username,hashedPassword,userID];
    await mysqlQuery(connection , insert , values ,userID)
    res.status(201).json({ message: 'User created successfully' });
  }
   catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getImgList = async function(req, res){
     const engineID = req.body.engineID;
     const sql = `SELECT * from imageData WHERE engineId = '${engineID}' `;
     const connection = new connectionHelper();
     connection.database = 'imgdb';
     try{
     const result = await mysqlQuery(connection , sql);
     res.status(200).send(result);
     }catch(err){
      res.status(500).json({success : false});
     }
}


app.post("/dev/create-instance", async(req, res) => {
  createInstance(req, res);
});
app.get("/dev/guireturn", async (req, res) => {
  DeliverData(req, res);
});
app.post("/dev/login", async(req, res)=>{
  loginHandler(req , res);
})
app.post("/dev/signup", async (req, res)=>{
  signUpHandler(req ,res)
})
app.get("/dev/imglist" , async(req, res)=>{
  getImgList(req , res);
})
app.get("/dev/", (req, res) => {
  res.send("HELLO");
});
app.get("/dev/welcome", (req, res) => {
  res.json({ message: "HARSH MC" });
});

