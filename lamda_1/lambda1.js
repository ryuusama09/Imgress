const express = require("express");
const serverless = require("serverless-http");
const { v4: uuidv4Generator } = require("uuid");
var bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const logger = require("./log");
require("dotenv").config();
const { connectionHelper, connection } = require("./mysqlHelper");
const mysqlQuery = require("./sql");
const app = express();
const cors = require("cors");
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//check this after completing all the functions, refactor the code :(
const PORT = 3003;
//console.log(process.env)
if (process.env.ENVIRONMENT === "lambda") {
  module.exports.handler = serverless(app);
} else {
  app.listen(PORT, () => {
    console.log("Hello");
  });
}

const apiGenerator = function (className) {
  const key = className;
  return `http://localhost:3005/dev/fetch/${key}`;
};

const classGenerator = function (engineName, engineID) {
  return engineName + engineID;
};

const createInstance = async function (req, res) {
  console.log(req.body);
  let uniqueEngineID = uuidv4Generator();
  uniqueEngineID = uniqueEngineID.replaceAll("-", "");
  const userID = req.body.userId;
  const name = req.body.name;
  const schema = req.body.schema;
  console.log(schema);
  let className = classGenerator(name, uniqueEngineID);
  className =
    className[0].toUpperCase() + className.slice(1, className.length - 1);
  const EngineApi = apiGenerator(className);
  console.log(className);
  //need to connect the tidb cluster 0

  const sql =
    "INSERT INTO EngineData (engineID, userID, apiURL,name,class) VALUES (?, ?, ?,?,?)";
  const sqlowner = "insert into access(owner , child, engineID) values(?,?,?)";
  const values = [uniqueEngineID, userID, EngineApi, name, className];
  const values2 = [userID, " ", uniqueEngineID];
  const connection = connectionHelper;
  await mysqlQuery(connection, sql, values)
    .then(async (response) => {
      console.log(response);
      await mysqlQuery(connection, sqlowner, values2).then(
        async (response2) => {
          console.log(response2);
          const statement = `created Engine Instance = ${name}`;
          await logger(uniqueEngineID, statement);
          res
            .status(200)
            .json({ response, response2, className, success: true });
        }
      );
    })
    .catch((err) => {
      res.status(404).json({ err });
    });
};

const deleteInstance = async function (req, res) {
  console.log(req.body);
  let uniqueEngineID = [];
  uniqueEngineID = req.body.engineID;
  // let names = req.body.names
  //need to connect the tidb cluster 0
  for (let i = 0; i < uniqueEngineID.length; i++) {
    try {
      const sql = `delete from EngineData where engineID = '${uniqueEngineID[i]}'`;
      const connection = connectionHelper;
      await mysqlQuery(connection, sql).then((response) => {
        const statement = `Deleted Engine Instance = ${uniqueEngineID[i]}`;
        logger(uniqueEngineID[i], statement);
      });
    } catch (err) {
      res.status(404).json(err);
    }
  }
  res.status(200).json({ success: true });
};

const DeliverData = async function (req, res) {
  console.log(req.body);
  try {
    const sql = `SELECT * FROM EngineData WHERE userID = '${req.body.userID}'`;
    const connection = connectionHelper;
    await mysqlQuery(connection, sql).then(async (response) => {
      res.status(200).send(response);
    });
  } catch (err) {
    res.status(404).json(err);
  }

  // connection.end();
};

const DeliverEngine = async function (req, res) {
  console.log(req.body);

  const sql = `SELECT * FROM EngineData WHERE engineID = '${req.body.engineID}'`;
  const sqlowner = `select owner from access where engineID = '${req.body.engineID}' and child = ''`;
  const connection = connectionHelper;
  let responseBody;
  await mysqlQuery(connection, sql)
    .then(async (response) => {
      responseBody = response;
      await mysqlQuery(connection, sqlowner).then(async (response2) => {
        responseBody.owner = response2.owner;
        res.status(200).send(responseBody);
      });
    })
    .catch((err) => {
      res.status(404).json(err);
    });

  // connection.end();
};

const loginHandler = async function (req, res) {
  //console.log(req.body);
  try {
    const { email, password } = req.body;
    //console.log(email , password)
    const sql = `SELECT * from userData WHERE email = '${email}' `;
    const connection = connectionHelper;
    // console.log(connection)
    const result = await mysqlQuery(connection, sql);
    if (Object.keys(result).length === 0) {
      res.send("no such user email you");
    }
    const query = Object.values(result)[0];
    const pass = Object.values(query)[2];
    const userID = Object.values(query)[3];
    const passwordMatch = await bcrypt.compare(password, pass);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ message: "Invalid username or password", success: false });
    }
    res
      .status(200)
      .json({ message: "Login successful", success: true, result });
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
};

const signUpHandler = async function (req, res) {
  try {
    const { email, password, username } = req.body;
    console.log(req.body);
    const sql = `SELECT * from userData WHERE email = '${email}' `;
    const result = await mysqlQuery(connection, sql);
    if (Object.keys(result).length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const insert =
      "INSERT INTO userData (email ,username,userPass , UserID) VALUES (?, ?, ? ,?)";
    // Save user to the database
    const userID = uuidv4Generator();
    const values = [email, username, hashedPassword, userID];
    await mysqlQuery(connection, insert, values, userID);
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getImgList = async function (req, res) {
  console.log("Hello", req.body.engineID);
  const engineID = req.body.engineID;
  const sql = `SELECT * from imageData WHERE engineId = '${engineID}' `;
  try {
    await mysqlQuery(connection, sql).then((response) => {
      res.status(200).send(response);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false });
  }
};

const getLogs = async (req, res) => {
  const engineID = req.body.engineID;
  const connection = connectionHelper;
  const sql = `select * from logging where engineID = '${engineID}'`;
  await mysqlQuery(connection, sql).then((response) => {
    res.status(200).send(response);
  });
};

const giveAccess = async (req, res) => {
  const owner = req.body.owner;
  const email = req.body.email;
  const connection = connectionHelper;
  const engineID = req.body.engineID;
  console.log(owner, email, engineID);

  const sql = `insert into access(owner , child, engineID) values(?,?,?)`;
  const sqlfetch = `select UserID from userData where email = '${email}'`;
  const values = [];
  await mysqlQuery(connection, sqlfetch).then(async (response) => {
    console.log(response);
    const sqlcheck = `select * from access where child = '${response[0].UserID}' and engineID = '${engineID}'`;
    await mysqlQuery(connection, sqlcheck).then(async (responseCheck) => {
      console.log(responseCheck);
      if (responseCheck.length !== 0) {
        res.status(201).send("user already exists");
        return;
      }
      values.push(owner);
      values.push(response[0].UserID);
      values.push(engineID);
      await mysqlQuery(connection, sql, values).then(async (response2) => {
        //console.log(response2, '2');
        await copyEntry(response[0].UserID, engineID, owner).then(
          (response3) => {
            // console.log(response3, "hi");
            res.status(200).json({ 1: response, 2: response2 });
          }
        );
      });
    });
  });
};
const copyEntry = async (UserID, engineID, owner) => {
  const sqlfetch = `select * from engineData where engineID = '${engineID}' and userID = '${owner}'`;
  const connection = connectionHelper;
  await mysqlQuery(connection, sqlfetch).then(async (response) => {
    // console.log("1" , response);
    const name = response[0].name;
    let className = response[0].class;
    const EngineApi = response[0].apiURL;
    const sql =
      "INSERT INTO EngineData (engineID, userID, apiURL,name,class) VALUES (?, ?, ?,?,?)";
    const values = [engineID, UserID, EngineApi, name, className];
    const connection = connectionHelper;
    await mysqlQuery(connection, sql, values).then(async (response2) => {
      const statement = `ownership of engine = ${name} given to user = ${UserID}`;
      await logger(engineID, statement).then((response3) => {
        return {
          1: response,
          2: response2,
          3: response3,
          className,
          success: true,
        };
      });
    });
  });
};
const DeletecopyEntry = async (UserID, engineID, owner) => {
  const sqlfetch = `select * from engineData where engineID = '${engineID}' and userID = '${owner}'`;
  const connection = connectionHelper;
  await mysqlQuery(connection, sqlfetch).then((response) => {
    const name = response.name;
    let className = response.class;
    // const EngineApi = response.apiURL;
    console.log(className);
    //need to connect the tidb cluster 0
    const sql = `Delete from EngineData where userID = '${UserID}' and engineID = '${engineID}'`;
    // const values = [engineID, UserID, EngineApi, name, className];
    const connection = connectionHelper;
    mysqlQuery(connection, sql).then((response) => {
      const statement = `revoked ownership of engine = ${name} from  user = ${UserID} by owner = ${owner}`;
      logger(engineID, statement).then((response2) => {
        return { 1: response, 2: response2, className, success: true };
      });
    });
  });
};
const takeAccess = async (req, res) => {
  const owner = req.body.owner;
  const email = req.body.email;
  const engineID = req.body.engineID;
  const connection = connectionHelper;
  let child;
  const sqlfetch = `select UserID from userData where email = '${email}'`;
  await mysqlQuery(connection, sqlfetch).then(async (response) => {
    console.log(response[0].UserID);
    child = response[0].UserID;
    const sql = `delete from access where owner = '${owner}' and child = '${child}' and engineID = '${engineID}'`;
    await mysqlQuery(connection, sql).then(async (response2) => {
      console.log(response2);
      await DeletecopyEntry(child, engineID, owner).then((response3) => {
        res.status(200).send({ 1: response, 2: response2 });
      });
    });
  });
};
const getAcessList = async (req, res) => {
  const owner = req.body.owner;
  const engineID = req.body.engineID;
  const connection = connectionHelper;
  // const email = req.body.email
  const sql = `select * from access where owner = '${owner}' and engineID = '${engineID}' and not child=''`;
  let emails = [];
  await mysqlQuery(connection, sql).then(async (response) => {
    console.log(response);
    if (response.length === 0) {
      return res.status(200).json([]);
    }
    await Promise.all(
      response.map(async (r) => {
        const sql2 = `select * from UserData where userID = '${r.child}'`;
        await mysqlQuery(connection, sql2).then((response2) => {
          console.log(response2);
          emails.push(response2[0].email);
        });
      })
    ).then(() => res.status(200).send(emails));
    // for (let i = 0; i < response.length; i++) {
    //   const sql2 = `select * from UserData where userID = '${response[i].child}'`;
    //   await mysqlQuery(connection, sql2).then((response2) => {
    //     console.log(response2);
    //     emails.push(response2[0].email);
    //   });
    // }
  });
};

app.post("/dev/create-instance", async (req, res) => {
  createInstance(req, res);
});
app.post("/dev/guireturn", async (req, res) => {
  DeliverData(req, res);
});
app.post("/dev/get-engine", async (req, res) => {
  DeliverEngine(req, res);
});
app.post("/dev/login", async (req, res) => {
  loginHandler(req, res);
});
app.post("/dev/signup", async (req, res) => {
  signUpHandler(req, res);
});
app.post("/dev/imglist", async (req, res) => {
  getImgList(req, res);
});
app.post("/dev/giveaccess", async (req, res) => {
  giveAccess(req, res);
});
app.post("/dev/takeaccess", async (req, res) => {
  takeAccess(req, res);
});
app.post("/dev/getaccesslist", async (req, res) => {
  getAcessList(req, res);
});
app.get("/dev/", (req, res) => {
  res.send("HELLO");
});
app.get("/dev/welcome", async (req, res) => {
  res.json({ message: "HARSH MC" });
});
app.post("/dev/delete-instance", async (req, res) => {
  deleteInstance(req, res);
});
app.post("/dev/getlogs", async (req, res) => {
  getLogs(req, res);
});
