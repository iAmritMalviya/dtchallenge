var express = require("express");
var ObjectID = require("mongodb").ObjectID;
var MongoClient = require("mongodb").MongoClient;
var fs = require("fs");
var multer = require("multer");
ejs = require("ejs");
path = require('path')
bodyParser = require("body-parser");
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
    if (req.query.id) {
      let id = req.query.id;
      dbo
        .collection("events")
        .find({ _id: ObjectID(id) })
        .toArray(function (err, result) {
          if (err) throw err;
          res.json(result);
        });
    } else if (req.query) {
      let { page, limit, type } = req.query;
      if (!page) {
        page = 1;
      }
      if (!limit) {
        limit = 10;
      }

      if (type == "latest") {
        type = -1;
      } else {
        type = 1;
      }
      console.log(type);

      limit = req.query.limit;

      try {
        dbo
          .collection("events")
          .find()
          .sort({ schedule: type })
          .skip(limit * (page - 1))
          .limit(parseInt(limit))
          .toArray(function (err, result) {
            if (err) {
              return err;
            }
            res.json(result);
          });
      } catch (err) {
        res.status(500).json({
          message: err,
        });
      }
    } else {
      dbo
        .collection("events")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          res.json(result);
        });
    }
  })
  .post( function (req, res) {
    console.log(req.file);
    
     
      // if (req.file == null) {
      //   res.send("you didnnot upload a picture ");
      // }
    

        // var newImg = fs.readFileSync(req.file.path);
        // var encImg = newImg.toString("base64");
        var newItem = {
          type: req.body.type,
          eventName: req.body.eventName,
          tagLine: req.body.tagLine,
          schedule: req.body.schedule,
          description: req.body.description,
          moderator: req.body.moderator,
          category: req.body.category,
          subcategory: req.body.subcategory,
          rigorRank: req.body.rigorRank,
          attendees: req.body.attendees,
          // size: req.file.size,
          // img: Buffer(encImg, "base64"),
          
          // contentType: req.file.mimetype,
        };


        dbo.collection("events").insertOne(newItem, function (err, result) {
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
var port = 5000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
