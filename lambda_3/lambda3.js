import weaviate from "weaviate-ts-client";
import { readFileSync, writeFileSync } from "fs";
import bodyParser from "body-parser";
import ServerlessHttp from "serverless-http";
import express, { response } from "express";
import cors from "cors";
import schemaConfig from "./schema.js";
const app = express();
//app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if (process.env.ENVIRONMENT === "lambda") {
  ServerlessHttp(app);
} else {
  app.listen(3005, () => {
    console.log("working");
  });
}

app.post(`/dev/fetch/*`, async (req, res) => {
  fetchImage(req, res);
});

app.post("/dev/create", async (req, res) => {
  createClass(req, res);
});

app.post("/dev/deleteContainers", async (req, res) => {
  deleteClass(req, res);
});

app.post("/dev/delete", async (req, res) => {
  deleteImage(req, res);
});

app.post("/dev/update", async (req, res) => {
  updateImg(req, res);
});
app.post("/dev/upload", async (req, res) => {
  upload(req, res);
});
app.get("/dev/schema", async (req, res) => {
  SchemaGetter(req, res);
});

const createClass = async function (req, res) {
  const client = weaviate.client({
    scheme: "http",
    host: "34.229.70.140:8080",
  });
  const className = req.body.name;

  const newSchema = schemaConfig;
  newSchema.class = className;
  if (req.body.schema !== null) {
    for (let i = 0; i < req.body.schema.length; i++) {
      newSchema.properties.push(req.body.schema[i]);
    }
  }
  console.log(newSchema);
  try {
    await client.schema
      .classCreator()
      .withClass(newSchema)
      .do()
      .then((response) => {
        res.status(200).send(response, "works !");
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    res.status(404).json({ success: false });
  }
};

const deleteClass = async function (req, res) {
  const client = weaviate.client({
    scheme: "http",
    host: "34.229.70.140:8080",
  });
  var classList = [];
  classList = req.body.classList;
  for (let i = 0; i < classList.length; i++) {
    try {
      await client.schema.delete_class(className);
    } catch (err) {
      res.status(404).json({ message: "error occurred" });
      return;
    }
  }
  res.status(200).json({ success: true });
};

const deleteImage = async function (req, res) {
  const client = weaviate.client({
    scheme: "http",
    host: "34.229.70.140:8080",
  });
  var ImgList = [];
  const className = req.body.className;
  ImgList = req.body.ImgList;
  for (var i = 0; i < ImgList.length; i++) {
    try {
      await client.data
        .deleter()
        .withClassName(className)
        .withId(ImgList[i])
        .do();
    } catch (err) {
      res.status(404).json({ err });
    }
  }
  res.status(200).json({ success: true });
};

const SchemaGetter = async function (req, res) {
  const client = weaviate.client({
    scheme: "http",
    host: "34.229.70.140:8080",
  });
  const classname = req.body.className;
  console.log(classname);
  try {
    client.schema
      .classGetter()
      .withClassName(classname)
      .do()
      .then((response) => {
        console.log();
        res.status(200).send(response.properties);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    res.status(404).json(err);
  }
};

const updateImg = async function (req, res) {
  const client = weaviate.client({
    scheme: "http",
    host: "34.229.70.140:8080",
  });

  const className = req.body.className;
  const imgId = req.body.imgId;
  const properties = req.body.properties;
  try {
    await client.data
      .merger() // merges properties into the object
      .withId(imgId)
      .withClassName(className)
      .withProperties({
        properties,
      })
      .do();
  } catch (err) {
    res.status(404).json(err);
  }
};

const fetchImage = async function (req, res) {
  const client = weaviate.client({
    scheme: "http",
    host: "34.229.70.140:8080",
  });
  const img = req.body.file; // i dont know how exactly

  const b64 = Buffer.from(img).toString("base64");

  // await client.data.creator()
  //   .withClassName('Testxz')
  //   .withProperties({
  //     image: b64,
  //     text: 'test',
  //     engineID : 13454,
  //     imageID : 242223
  //   })
  //   .do();

  const test = Buffer.from(readFileSync("./imgg.jpeg")).toString("base64");

  const resImage = await client.graphql
    .get()
    .withClassName("Testxz")
    .withFields(["image"])
    .withNearImage({ image: test })
    .withLimit(1)
    .do();
  const result = resImage.data.Get.Testxz[0].image;
  //writeFileSync('./result.jpeg', result, 'base64');

  res.send(result);
};

const upload = async function (req, res) {
  const className = req.body.className
  const engineID  = req.body.engineID
  const ids = req.body.imageIds;
  const files = req.files
  var b64collection = []
  for(let i = 0; i < files.length ; i++){
    b64collection.push(Buffer.from(files[i]).toString('base64'))
  }
  for(let i = 0; i < ids ;i++){
    await client.data
    .creator()
    .withClassName(className)
    .withProperties({
      image: b64collection[i],
      text: "matrix meme",
      engineID : engineID,
      imageID : ids[i]
    })
    .do();
  }
  
};
