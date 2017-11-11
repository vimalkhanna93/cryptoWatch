var express = require('express');
var app = express();
var request = require('request');
app.get('/watch', function (req, res) {
  var RequestURL='https://api.coinmarketcap.com/v1/ticker/';
  request(RequestURL, function (error, response, body) {
    if (!error) {
      var result = JSON.parse(body);
      for(var i=0;i<result.length;i++) {
        console.log(result[i].symbol + " " + result[i].price_usd);
      }
    }
  })
});
app.listen(3000, function () {
});
