const express = require( "express");
const mysql = require("mysql");
const serverless = require("serverless-http");
const { v4: uuidv4Generator } = require('uuid')
const app = express();
const fs = require('fs');
const mysqlQuery = require('../sql')
const connection = require('../mysqlHelper')
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
const PORT = 3004;

app.get("/dev/", (req, res) => {
  res.send("HELLO");
});

app.get("/dev/welcome", (req, res) => {
  res.json({ message: "HARSH MC" });
});

if (process.env.ENVIRONMENT === "lambda") {
  module.exports.handler = serverless(app);
} else {
  app.listen(PORT, () => {
    console.log("Hello");
  });
}



const mysql = require('mysql')

 

//const uuid = require('uuid')
const uploadTiDb = async function (req , res){
    

}

const deleteTidb = async function (req ,res){
  
  
} 
  
    


app.post("/uploadtidb", async (req , res) =>{
  const result = uploadTiDb(req , res)
  res.send(result)
})
