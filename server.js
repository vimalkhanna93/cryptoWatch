const express = require('express');
const app = express();
const request = require('request');

app.get('/watch', function (req, res) {
  console.log("Hello World");
  var RequestURL='https://api.coinmarketcap.com/v1/ticker/';
  request(RequestURL, function (error, response, body) {
    if (!error) {
      var parsedBody = JSON.parse(body);
      res.send(parsedBody);
      // for(var i=0;i<parsedBody.length;i++) {
      //   console.log(parsedBody[i].name + " " + parsedBody[i].price_usd);
      // }
    }
  })
});

app.listen(3000);
