const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require('mongodb').MongoClient;
var user = {};
var list = {};

MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
  if (err) throw err;
  db.createCollection("users");
  db.collection("users").createIndex({ "email" :1},{ unique: true } )
  db.close();
});

app.post('/register', function (req,res) {
  var user = req.body;
  MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
    db.collection("users").findOne(user, function(err, result) {
      if(result == null) {
        db.collection("users").insertOne(user);
        db.close();
        res.send("user created");
      }
      else res.send("exist");
    });
  });
});

app.post('/login', function(req,res) {
  user = req.body;
  MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
    db.collection("users").findOne(user, function(err, result) {
      if(result == null) {
        res.send("no user found");
      }
      else if(user.password == result.password) {
        res.send("ok");
      }
      db.close();
    });
  });
})

app.get('/display', function(req,res) {
  var coins = [];
  coinDetails = [];
  MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
    db.collection("users").findOne(user, function(err, result) {
      coins = result.coins;
    });
    db.close();
    request('https://api.coinmarketcap.com/v1/ticker/', function (error, response, body) {
      var list = JSON.parse(body);
       for(var i=0;i<coins.length;i++) {
        for(var j=0;j<list.length;j++) {
          if(coins[i] == list[j].id) {
            if(list[j].percent_change_1h > 0) list[j].color = "static/svg/up.svg";
            else list[j].color = "static/svg/down.svg";
            coinDetails.push(list[j]);
          }
        }
      }
      res.send(coinDetails);
    });
  });
});

app.get('/add', function (req, res) {
  MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
    db.collection("users").update({email:user.email},{$addToSet:{coins:req.query.coin}});
    db.close();
  });
});

app.get('/remove', function (req, res) {
  MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
    db.collection("users").update({email:user.email},{$pull:{coins:req.query.coin}});
    db.close();
  });
});

app.get('/math', function(req, res) {
  res.send(coinDetails);
});

app.listen(3000);
