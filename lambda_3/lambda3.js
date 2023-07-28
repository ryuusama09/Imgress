import bodyParser from "body-parser";
import cors from "cors";
import ServerlessHttp from "serverless-http";
import express, { response } from "express";
import multer from "multer";
import schemaConfig from "./schema.js";
import getFetchedLink from "./link.js";
import logger from "./log.js";
import client from "./clientConfig.js";
import "dotenv/config";
const app = express();
app.use(cors());
var storage = multer.memoryStorage();
var upload2 = multer({ storage: storage });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
if (process.env.ENVIRONMENT === "lambda") {
  ServerlessHttp(app);
} else {
  app.listen(parseInt(process.env.PORT_L_3), () => {
    console.log("working");
  });
}

app.post(`/dev/fetch/*`, upload2.any(), async (req, res) => {
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
app.post("/dev/upload", upload2.any(), async (req, res) => {
  upload(req, res);
});
app.post("/dev/schema", async (req, res) => {
  SchemaGetter(req, res);
});
app.post("/dev/properties", async (req, res) => {
  propertyGetter(req, res);
});

const createClass = async function (req, res) {
  const className = req.body.name;
  console.log(className);
  const newSchema = schemaConfig;
  newSchema.class = className;
  console.log(req.body);
  if (req.body?.schema !== undefined) {
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
        console.log(response);
        res.status(200).send(response);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    res.status(404).json({ success: false });
  }
};

const deleteClass = async function (req, res) {
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
  const classname = req.body.className;
  console.log(classname);

  client.schema
    .classGetter()
    .withClassName(classname)
    .do()
    .then((response) => {
      console.log("Hello", response);
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
};

const updateImg = async function (req, res) {
  const engineID = req.body.engineID;
  const className = req.body.className;
  const imgId = req.body.imgId;
  const properties = req.body.properties;
  console.log(engineID, className, imgId, properties);
  await client.data
    .merger() // merges properties into the object
    .withId(imgId)
    .withClassName(className)
    .withProperties(properties)
    .do()
    .then(async (response) => {
      const statement = `updated image with id = '${imgId}' from engine = '${className}'`;
      await logger(engineID, statement)
        .then((response) => {
          res.status(200).send("ok!");
        })
        .catch((err) => {
          console.log(err);
          res.status(404).json(err);
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(404).json(err);
    });
};

const fetchImage = async function (req, res) {
  let url = req.originalUrl;
  let limit = req.body.limit;
  url = url.replace("/dev/fetch/", "");
  const img = req.files[0];
  // console.log(img);
  const b64 = Buffer.from(img.buffer).toString("base64");
  const resImage = await client.graphql
    .get()
    .withClassName(url)
    .withFields(["image", "engineID"])
    .withNearImage({ image: b64 })
    .withLimit(limit)
    .do();
  //const result = resImage.data.Get[url][0].image;
  const res2 = resImage.data.Get[url];
  var images = [];
  await Promise.all(
    res2.map(async (r) => {
      const ans = await getFetchedLink(r.imageID);
      images.push(ans[0].image);
    })
  );
  console.log(images);
  res.status(200).json({ message: "Success", images, res2 });
};

const uploadWeaviate = async (req, className, engineID) => {
  console.log(req.files);
  const files = req.files;
  var b64collection = [];
  let ids = [];
  try {
    console.log(files.length);
    for (let i = 0; i < files.length; i++) {
      b64collection.push(Buffer.from(files[i].buffer).toString("base64"));
    }
    for (let i = 0; i < files.length; i++) {
      const res = await client.data
        .creator()
        .withClassName(className)
        .withProperties({
          image: b64collection[i],
          engineID: engineID,
        })
        .do();
      console.log("helo", res);
      ids.push(res.id);
    }
  } catch (e) {
    console.log(e);
  }
  return { success: true, ids };
};
const propertyGetter = async (req, res) => {
  const imgId = req.body.imageID;
  const className = req.body.className;
  await client.data
    .getterById()
    .withClassName(className)
    .withId(imgId)
    .do()
    .then(async (response) => {
      let data = response;
      const { image, engineID, ...rest } = data.properties;
      data.properties = rest;
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err);
      res.status(404).send(err);
    });
};
const upload = async function (req, res) {
  const className = req.body.className;
  const engineID = req.body.engineId;
  console.log(className, engineID);
  const response = await uploadWeaviate(req, className, engineID);
  if (response.success) {
    res.status(201).json({ message: "Success", ids: response.ids });
  } else {
    res.status(500).json({ message: "Failure" });
  }
};
