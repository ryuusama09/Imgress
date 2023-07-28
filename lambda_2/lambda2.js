const express = require("express");
const mysql = require("mysql");
const serverless = require("serverless-http");
const { v4: uuidv4Generator } = require("uuid");
const app = express();
const logger = require("./log");
const fs = require("fs");
const cors = require("cors");
const mysqlQuery = require("./sql");
const { connectionHelper, connection } = require("./mysqlHelper");
const bodyParser = require("body-parser");
const multer = require("multer");
const AWS = require("aws-sdk");
const config = require("./s3conf");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
app.use(cors());
const PORT = 3004;

if (process.env.ENVIRONMENT === "lambda") {
  module.exports.handler = serverless(app);
} else {
  app.listen(PORT | parseInt(process.env.PORT_L_2), () => {
    console.log("Hello");
  });
}

const uploadS3Img = async (req) => {
  const s3 = new AWS.S3();
  s3.config.update(config);
  let links = [];
  // const filePath = "C:/Users/ryusama09/Downloads/back-2.avif";
  const files = req.files;
  console.log(files);
  const ids = req.body.imageIds.split(",");
  const classname = req.body.className;
  const params = {
    Bucket: process.env.S3_BUCKET,
    Body: "",
    Key: "",
  };
  for (let i = 0; i < files.length; i++) {
    const key = `${classname}/${ids[i]}`;
    params.Key = key;
    params.Body = files[i].buffer;
    await new Promise((resolve, reject) => {
      s3.upload(params, function (err, data) {
        if (err) {
          reject(err);
        } else {
          console.log(
            "File uploaded successfully. File location:",
            data.Location
          );
          //res.status(200).send(data.Location)
          resolve(data.Location);
        }
      });
    }).then((link) => {
      links.push(link);
    });
  }
  return links;
};

const uploadTidb = async function (req, res) {
  // how can we upload imgs to imgdb
  // console.log(req.files, "hi", req.body);
  const links = await uploadS3Img(req);
  console.log(links, "hi");
  const className = req.body.className;
  const ids = req.body.imageIds.split(",");
  const engineID = req.body.engineId;
  console.log(ids, className, engineID);
  const sql =
    "insert into imageData(engineId , image , className, imageID) values ( ? , ? , ? , ?)";

  for (let i = 0; i < ids.length; i++) {
    let values = [];
    values.push(engineID);
    values.push(links[i]);
    values.push(className);
    values.push(ids[i]);
    console.log(values);
    await mysqlQuery(connection, sql, values).then(async (response, err) => {
      console.log(response);
      if (err !== undefined) {
        console.log(err);
        res.status(500).send("error");
      }
      const statement = `uploaded image with id = ${ids[i]} in engine = ${className}`;
      await logger(engineID, statement);
    });
  }
  if (res.headersSent !== true) {
    res.status(200).send("Hello World!");
  }
};

const deleteS3container = async function (bucket, dir) {
  const listParams = {
    Bucket: bucket,
    Prefix: dir,
  };
  var s3 = new AWS.S3(listParams);
  s3.config.update(config);
  const listedObjects = await s3.listObjectsV2(listParams).promise();

  if (listedObjects.Contents.length === 0) return;

  const deleteParams = {
    Bucket: bucket,
    Delete: { Objects: [] },
  };

  listedObjects.Contents.forEach(({ Key }) => {
    deleteParams.Delete.Objects.push({ Key });
  });

  await s3.deleteObjects(deleteParams).promise();

  if (listedObjects.IsTruncated) await deleteS3container(bucket, dir);
};

const deleteS3Images = async function (req, res) {
  const s3 = new AWS.S3();
  s3.config.update(config);
  const dir = req.body.className;
  var ids = req.body.imageIds;
  var filename;
  for (let i = 0; i < ids.length; i++) {
    filename = ids[i];
    const params = {
      Bucket: "imgress-1",
      Key: `${dir}/${filename}`,
    };
    s3.deleteObject(params, (error, data) => {
      if (error) {
        res.status(500).send(error);
      }
    });
  }
  res.status(200).send("Files has been deleted successfully");
};

const deleteTidbContainers = async function (req, res) {
  const className = req.body.className;
  const sql = `delete from imageData where className = '${className}'`;
  //const sqlfetch = `select * from imageData where engineId = ${engineID}`;

  await mysqlQuery(connection, sql)
    .then((responseNew) => {
      res.status(200).json({ success: true, responseNew });
    })
    .catch((e) => {
      console.log(e);
      res.status(404).send(e);
    });
};

const deleteTidbImages = async function (req, res) {
  const uniqueEngineID = req.body.uniqueEngineID;
  let imageId;
  for (let i = 0; i < req.body.imageId.length; i++) {
    imageId = req.body.imageId[i];
    let sql = `delete from imageData where imageId = '${imageId}'`;
    console.log(imageId, sql);
    try {
      await mysqlQuery(connection, sql).then((responseNew) => {
        console.log(responseNew);
        const statement = `Deleted Image with id = ${imageId}  from container = ${uniqueEngineID}`;
        logger(uniqueEngineID, statement);
      });
    } catch (err) {
      res.status(404).send(err);
    }
  }
  res.status(200).json({ success: true });
};

app.get("/dev/", (req, res) => {
  res.send("HELLO");
});

app.get("/dev/welcome", (req, res) => {
  res.json({ message: "HARSH MC" });
});
app.post("/dev/deletetidbimg", async (req, res) => {
  deleteTidbImages(req, res);
});
app.post("/dev/deletes3img", async (req, res) => {
  deleteS3Images(req, res);
});
app.post("/dev/deletetidbcont", async (req, res) => {
  deleteTidbContainers(req, res);
});
app.post("/dev/upload", upload.any(), async (req, res) => {
  uploadTidb(req, res);
});
app.post("/dev/deletes3cont", async (req, res) => {
  let className = req.body.className;
  className += "/";
  await deleteS3container("imgress-1", className).then(res.send("deleted !"));
});
