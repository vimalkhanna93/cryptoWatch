var express = require('express');
var app = express();
var request = require('request');
app.get('/hello', function (req, res) {
  var RequestURL='https://api.coinmarketcap.com/v1/ticker/';
  request(RequestURL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  })
});
app.listen(3000, function () {
});
