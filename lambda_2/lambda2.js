const express = require( "express");
const mysql = require("mysql");
const serverless = require("serverless-http");
const { v4: uuidv4Generator } = require('uuid')
const app = express();
const fs = require('fs');
const mysqlQuery = require('../sql')
const connection = require('../mysqlHelper');
const connectionHelper = require("../mysqlHelper");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
const PORT = 3004;



if (process.env.ENVIRONMENT === "lambda") {
  module.exports.handler = serverless(app);
} else {
  app.listen(PORT, () => {
    console.log("Hello");
  });
}

const imgConfig = multer.diskStorage({
  destination: (req, file, callback) => {
    const dir = "./uploads";
    callback(null, dir);
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: imgConfig });

app.post("/dev/upload-images", upload.array("files"), (req, res) => {
  const files = req.files;
  const PATH = "http//localhost:3004/";
  const engineId = "23232";
  try {
    for (var i = 0; i < files.length; i++) {
      const fileName = files[i].originalname;
      const sql = "INSERT INTO imageData (engineId,image) values(?,?)";
      const values = [engineId, `${PATH}uploads/${fileName}`];
      mysqlQuery(connection, sql, values);
    }
    res.json({ message: "Success" });
  } catch (e) {
    console.log(e);
    res.json({ message: "Failure" });
  }
});


const deleteTidbContainers = async function (req ,res){
  const engineID = req.body.engineID;
  const sql = `delete from imageData where engineId = ${engineID}`;
  const connection = connectionHelper
  try{
    await mysqlQuery(connection , sql).then(response=>{
      res.status(200).json({success : true, response})
    })
  }catch(err){
    res.status(404).send(err)
  }
 
} 

const deleteTidbImages = async function(req ,res){
  const connection = connectionHelper;
  let imageId;
  let sql = `delete from imageData where imageId = ${imageId}`
  connection.config.database = 'imgdb'
    for(let i = 0 ; i < req.body.imageIdList; i++){
      imageId = req.body.imageIdList[i];
      try{
        await mysqlQuery(connection , sql)
      }
      catch(err){
        res.status(404).send(err)
      }
    }
    res.status(200).json({success : true })
}

  
    


app.post("/dev/uploadtidb", async (req , res) =>{
  const result = uploadTiDb(req , res)
  res.send(result)
})
app.get("/dev/", (req, res) => {
  res.send("HELLO");
});

app.get("/dev/welcome", (req, res) => {
  res.json({ message: "HARSH MC" });
});
app.post("/dev/deletetidbimg", async (req , res) =>{
    deleteTidbImages(req , res)
})
app.post("/dev/deletetidbcont", async (req , res) =>{
   deleteTidbContainers(req , res)
})  
