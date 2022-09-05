var express = require("express");

const { default: mongoose } = require("mongoose");
(ejs = require("ejs")), (bodyParser = require("body-parser"));
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
let uid;
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/eventDB");

// var uid = mongoose.Types.ObjectId();
const eventSchema = new mongoose.Schema({
  // "type:""event""
  // _id: uid,
  eventName: String,
  tagLine: String,
  schedule: Date,
  description: String,
  // files[image]: Image file (File upload)
  moderator: String,
  category: String,
  subcategory: String,
  rigorRank: String,
  attendees: String,
  // attendees: Array of user Id's who is attending the event
  // "
});
const Event = mongoose.model("event", eventSchema);

app.get("/", function (req, res) {
  res.render("home", { id: uid });
});

app.route('/events')
.get(function (req, res) {
  // console.log(req.query.id);
  if (!req.query.id && !req.query.page && !req.query.limit) {
    Event.find({}, function (err, data) {
      if (err) {
        return err;
      } else {
        res.render("events", { data: data });
        // res.json((data));
      }
    });
  } else if (req.query.id) {
    Event.find({ _id: req.query.id }, function (err, data) {
      if (err) {
        res.send(err.message);
      } else {
        res.render("events", { data: data });
      }
    });
  } else {
    let page = req.query.page;
    let limit = req.query.limit;

    // let data =  Event.find({}).paginate({page: page, limit: limit}).exec();
    const data = Event.find({}).limit(limit);
    console.log(data);
    Event.find({})
      .limit(limit)
      .exec(function (err, data) {
        // `posts` will be of length 20
        res.render("events", { data: data });
      });
  }
})
.post(async function (req, res) {
  let eventDetails = new Event(req.body);

  eventDetails.save((err, doc) => {
    if (err) {
      return err;
    } else {
      uid = doc._id.toString();
      console.log(doc);
      
     res.send("successfully created with event id is:" + uid);
    }
  });
  // res.redirect("back");
});
app.route('/events/:id')
.delete(function (req, res) {
  Event.deleteOne({_id: req.params.id}).then(function(){
     res.send('data deleted')
  }).catch(function (err) {
   res.send(err);
    
  })
})
.put(function(req, res)  {
Event.findOne({id: req.params.id}, function (err, data) {
 
  data = req.body;
    // data.eventName = req.body.eventName;
    // data.tagLine =  req.body.tagLine
    // data.schedule =  req.body.schedule
    // data.description =  req.body.description
    // data.moderator =  req.body.moderator
    // data.category =  req.body.category
    // data.subcategory =  req.body.subcategory
    // data.rigorRank =  req.body.rigorRank
    // data.attendees =  req.body.attendees
  
  
  data.save();
  res.send(data)
})

});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
