const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
  if (err) throw err;
  // console.log("Database created!");
  db.createCollection("users", function(err, res) {
    if (err) throw err;
    // console.log("Collection created!");
  });
  db.close();
});

app.get('/watch', function (req, res) {
  var coinName = req.query.coin;
  var RequestURL='https://api.coinmarketcap.com/v1/ticker/';
  request(RequestURL, function (error, response, body) {
    if (!error) {
      var coinList = JSON.parse(body);
      for(var i=0;i<coinList.length;i++) {
        if(coinList[i].id == coinName) {
          res.send(coinList[i]);
        }
      }
    }
  })
});

app.post('/register', function (req, res) {
  var user = req.body;
  MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
    db.collection("users").insertOne(user, function(err, res) {
      if (err) throw err;
      db.close();
    });
  });
});

app.listen(3000);
