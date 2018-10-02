var express = require("express");
var bodyParser = require("body-parser");
var mongodb = require("mongodb");
var ObjectID = mongodb.ObjectID;

var USERS = "users";
var EVENTS = "events";

var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, Accept');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
      res.send(200);
  } else {
      next();
  }
};
app.use(allowCrossDomain);

app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist'));

let port = process.env.PORT || 8080;
let dbport = process.env.DB_PORT || 27017;

// Create a database variable outside of the database connection callback to reuse the connection pool in your app.
var db;


// Connect to the database before starting the application server.
mongodb.MongoClient.connect(process.env.MONGODB_URI || "mongodb://localhost:"+dbport+"/calendar", function (err, client) {
  if (err) {
    console.log(err);
    process.exit(1);
  }

  // Save database object from the callback for reuse.
  db = client.db();
  console.log("Database connection ready");

  // Initialize the app.
  var server = app.listen(port, function () {
    console.log("App now running on port", server.address().port);
  });
});

// Generic error handler used by all endpoints.
function handleError(res, reason, message, code) {
  console.log("ERROR: " + reason);
  res.status(code || 500).json({"error": message});
}

/*  "/api"
 *    GET: API welcome message
 */

app.get("/api", function(req, res) {
  res.status(200).json({"status": "200", "message": "Welcome to the team calendar API"});
});


/*  "/api/users"
 *    GET: finds all users
 *    POST: creates a new user
 */

app.get("/api/users", function(req, res) {
  db.collection(USERS).find({}).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get users.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/users", function(req, res) {
  var newUser = req.body;
  newUser.createDate = new Date();

  if (!req.body.name) {
    handleError(res, "Invalid user input", "Must provide a name.", 400);
  } else {
    db.collection(USERS).insertOne(newUser, function(err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new user.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/users/:id"
 *    GET: find user by id
 *    PUT: update user by id
 *    DELETE: deletes user by id
 */

app.get("/api/users/:id", function(req, res) {
  db.collection(USERS).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get user");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/users/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;
  db.collection(USERS).replaceOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update user");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/users/:id", function(req, res) {
  db.collection(USERS).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete user");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});



/*  "/api/events"
 *    GET: finds all events
 *    POST: creates a new event
 */

app.get("/api/events", function(req, res) {
  query = {}
  if(req.query.start){
    query["end"] = {"$gt": req.query.start}
  }
  if(req.query.end){
    query["start"] = {"$lt": req.query.end}
  }
  db.collection(EVENTS).find(query).toArray(function(err, docs) {
    if (err) {
      handleError(res, err.message, "Failed to get events.");
    } else {
      res.status(200).json(docs);
    }
  });
});

app.post("/api/events", function(req, res) {
  var newEvent = req.body;
  newEvent.createDate = new Date();
  if (!req.body.user) {
    handleError(res, "Invalid event input", "Must provide a user for the event.", 400);
  }
  else if (!req.body.type) {
    handleError(res, "Invalid event input", "Must provide an event type.", 400);
  } 
  else if (!req.body.start) {
      handleError(res, "Invalid event input", "Must provide an event start date.", 400);
  } 
  else if (!req.body.end) {
    handleError(res, "Invalid event input", "Must provide an event end date.", 400);
  } 
  else {
    db.collection(EVENTS).insertOne(newEvent, function (err, doc) {
      if (err) {
        handleError(res, err.message, "Failed to create new event.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  }
});

/*  "/api/events/:id"
 *    GET: find event by id
 *    PUT: update event by id
 *    DELETE: deletes event by id
 */

app.get("/api/events/:id", function(req, res) {
  db.collection(EVENTS).findOne({ _id: new ObjectID(req.params.id) }, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to get event");
    } else {
      res.status(200).json(doc);
    }
  });
});

app.put("/api/events/:id", function(req, res) {
  var updateDoc = req.body;
  delete updateDoc._id;

  db.collection(EVENTS).replaceOne({_id: new ObjectID(req.params.id)}, updateDoc, function(err, doc) {
    if (err) {
      handleError(res, err.message, "Failed to update event");
    } else {
      updateDoc._id = req.params.id;
      res.status(200).json(updateDoc);
    }
  });
});

app.delete("/api/events/:id", function(req, res) {
  db.collection(EVENTS).deleteOne({_id: new ObjectID(req.params.id)}, function(err, result) {
    if (err) {
      handleError(res, err.message, "Failed to delete event");
    } else {
      res.status(200).json(req.params.id);
    }
  });
});


// serve the frontend
app.use('*', (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
});
