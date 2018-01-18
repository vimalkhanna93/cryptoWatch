const express = require('express');
const app = express();
const request = require('request');
const bodyParser = require('body-parser');
const fs = require('fs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var MongoClient = require('mongodb').MongoClient;
var loginUser = "";
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
  var user = req.body;
  MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
    db.collection("users").findOne(user, function(err, result) {
      if(user.password == result.password) {
        loginUser = user.email;
        res.send("ok");
      }
      else res.send("not");
      db.close();
    });
  });
})

app.get('/add', function (req, res) {
  var coin = req.query.coin;
  console.log(coin);
  request('https://api.coinmarketcap.com/v1/ticker/', function (error, response, body) {
    var list = JSON.parse(body);
    for(var i=0;i<list.length;i++) {
      if(list[i].id == coin) {
        MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
          db.collection("users").update({ email : loginUser},{$push: {coins:coin}});
//           db.collection("users").update({ email : loginUser},{$set: {
//        item: "ABC123",
//        "info.publisher": "2222",
//        tags: [ "software" ],
//        "ratings.1": { by: "xyz", rating: 3 }
//      }
//    }
// )
          db.close();
        });
        res.send(list[i]);
      }
    }
  })
});

app.get('/remove', function (req, res) {
  var coin = req.query.coin;
  MongoClient.connect("mongodb://localhost:27017/user-details", function(err, db) {
    db.collection(loginUser).remove(coin);
    db.close();
  });
});

app.listen(3000);
