var express = require("express");
var ObjectID = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;
(ejs = require("ejs")), (bodyParser = require("body-parser"));
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
let uid;
let dbo;
let url = "mongodb://localhost:27017/";
app.use(express.static("public"));
MongoClient.connect(url, function (err, db) {
  if (err) throw err;

  dbo = db.db("eventsdb");
  dbo.createCollection("events", function (err, res) {
    if (err) {
      return err;
    }
    console.log("Database created!");
    db.close();
  });
});

app.get("/", function (req, res) {
  res.render("home", { id: uid });
});

app
  .route("/events")
  .get(function (req, res) {
    let {page , limit, type } = req.query;
    if (!page) {  
      page = 1;
  }
  if (!limit) {
      limit = 10;
  }
  if(!type)
  {
    if (type === 'latest') {
      type = -1;
    } else {
      type = 1
    }
  }
  
    if (!req.query.id && !req.query.page && !req.query.limit) {
      dbo
        .collection("events")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          res.json(result);
        });
    } else if (req.query.id) {
      console.log(req.query.id);
      let id = req.query.id;
      dbo
        .collection("events")
        .find({ _id: ObjectID(id) })
        .toArray(function (err, result) {
          if (err) throw err;
          res.json(result);
        });
    } else {
      let page = req.query.page;
      let limit = parseInt(req.query.limit);
      try{
       

        
        dbo
        .collection("events")
        .find()
        .sort({eventName: 1})
        .skip(limit * (page - 1))
        .limit(limit)
        .toArray(function (err, result) {
          if (err) {
            return err;
          }
          res.json(result);
        });
      }
      catch(err)
      {
          res.status(500).json({
            message: err
          })
      }
    }
  })
  .post(async function (req, res) {
    dbo.collection("events").insertOne(req.body, function (err, result) {
      if (err) {
        return err;
      }
      console.log("data inserted");
      res.json(result);
    });
  });
app
  .route("/events/:id")
  .delete(function (req, res) {
    dbo
      .collection("events")
      .deleteOne({ _id: ObjectID(req.params.id) })
      .then(function () {
        res.send("data deleted");
      })
      .catch(function (err) {
        res.send(err);
      });
  })
  .put(function (req, res) {
    let id = req.params.id;
    console.log(req.body);

    let newdetails = { $set: req.body };
    let query = { _id: ObjectID(id) };
    dbo
      .collection("events")
      .updateOne(query, newdetails, function (err, result) {
        if (err) return err;
        console.log("1 document updated");
        res.json(result);
      });
  });
var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});