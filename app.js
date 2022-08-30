let express = require("express");
let ejs = require("ejs");
const mongodb = require("mongodb");
let path = require("path");

let app = express();
const PORT_NUMBER = 8081;

app.listen(PORT_NUMBER, () => {
  console.log(`Listening on port ${PORT_NUMBER}`);
});

// localhost:8080/css/bootstrap.min.css
// localhost:8080/js/bootstrap.min.js
app.use("/css", express.static(path.join(__dirname, "node_modules/bootstrap/dist/css")));
app.use("/js", express.static(path.join(__dirname, "node_modules/bootstrap/dist/js")));
app.use(express.urlencoded({ extended: true }));

// Configure Express for EJS
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

//Configure MongoDB
const MongoClient = mongodb.MongoClient;
// Connection URL
const url = "mongodb://localhost:27017/";

let db;
//Connect to mongoDB server
MongoClient.connect(url, { useNewUrlParser: true }, function (err, client) {
  if (err) {
    console.log("Err  ", err);
  } else {
    console.log("Connected successfully to server");
    db = client.db("fleet");
  }
});

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/addcar", function (req, res) {
  res.sendFile(path.join(__dirname, "views/addcar.html"));
});

app.post("/newcar", function (req, res) {
  let car = req.body;

  db.collection("cars").insertOne(car);
  res.redirect("/");
});

app.get("/getcars", function (req, res) {
  db.collection("cars")
    .find({})
    .toArray(function (err, data) {
      res.render("getcars", { cars: data });
    });
});

app.get("/delcar", function (req, res) {
  res.sendFile(path.join(__dirname, "views", "delbyid.html"));
});

app.post("/delcar", function (req, res) {
  let id = req.body.id;
  db.collection("cars").deleteOne({ _id: mongodb.ObjectId(id) });
  res.redirect("/getcars");
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "views/404.html"));
});
