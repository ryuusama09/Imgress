const express = require( "express");
const mysql = require("mysql");
const serverless = require("serverless-http");
const { v4: uuidv4Generator } = require('uuid')
const app = express();
const fs = require('fs');
const cors = require('cors')
const mysqlQuery = require('../sql')
const connectionHelper = require("../mysqlHelper");
const bodyParser = require("body-parser");
const multer = require('multer')
const AWS = require('aws-sdk')
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json());
app.use(cors())
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

// app.post("/dev/upload-images", upload.array("files"), (req, res) => {
//   const files = req.files;
//   console.log('works')
  
//   const PATH = "http//localhost:3004/";
//   const engineId = "23232";
//   const connection = connectionHelper;
//   connection.config.database = 'imgdb';
//   try {
//     for (var i = 0; i < files.length; i++) {
//       const fileName = files[i].originalname;
//       const sql = "INSERT INTO imageData (engineId,image) values(?,?)";
//       const values = [engineId, `${PATH}uploads/${fileName}`];
//       mysqlQuery(connection, sql, values);
//     }
//     res.json({ message: "Success" });
//   } catch (e) {
//     console.log(e);
//     res.json({ message: "Failure" });
//   }
// });

const uploadImg = async function ( req, res){
  const s3 = new AWS.S3();
s3.config.update({
  accessKeyId: 'AKIA47AMLKB3ZK5V5XF2',
  secretAccessKey: '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',
 
});
const filePath = 'C:/Users/ryusama09/Downloads/back-2.avif'
const fileContent = fs.readFileSync(filePath);
const key ='test'
  const params = {
    Bucket: 'imgress-1',
    Body: fileContent,
    Key: key,
  };

  s3.upload(params, function (err, data) {
    if (err) {
      console.log('Error uploading file:', err);
    } else {
      console.log('File uploaded successfully. File location:', data.Location);
       res.status(200).send(data.Location)
    }
  });

}

const deleteMulter = function(path){
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err)
      return 
    }
   
  })
}


const deleteTidbContainers = async function (req ,res){
  const engineID = req.body.engineID;
  const sql = `delete from imageData where engineId = ${engineID}`;
  const sqlfetch = `select * from imageData where engineId = ${engineID}`; 
  const connection = connectionHelper
    connection.config.database = 'imgdb'
  try{
    await mysqlQuery(connection , sqlfetch).then(response=>{
      for(let i = 0 ;i < response.length; i++){
        const path = response[i].image;
        deleteMulter(path)
      }
       mysqlQuery(connection , sql).then(responseNew=>{
        res.status(200).json({success : true , responseNew})
       })
    })
  }catch(err){
    res.status(404).send(err)
  }
 
} 

const deleteTidbImages = async function(req ,res){
  const connection = connectionHelper;
  let imageId;
  let sql = `delete from imageData where imageId = ${imageId}`
  const sqlfetch = `select * from imageData where imageId= ${imageId}`; 
  connection.config.database = 'imgdb'
  for(let i = 0;i < req.body.imgList.length; i++){
    imageId = req.body.imgList[i];
  try{
    await mysqlQuery(connection , sqlfetch).then(response=>{
        const path = response[i].image;
        deleteMulter(path)
       mysqlQuery(connection , sql).then(responseNew=>{
        res.status(200).json({success : true , responseNew})
       })
    })
  }catch(err){
    res.status(404).send(err)
  }
}
}

  
    


// app.post("/dev/uploadtidb", async (req , res) =>{
//   const result = uploadTiDb(req , res)
//   res.send(result)
// })
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
app.post("/dev/upload", async (req , res) =>{
  uploadImg(req , res)
})  
