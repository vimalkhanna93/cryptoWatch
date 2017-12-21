const express = require('express');
const app = express();
const request = require('request');

app.get('/watch', function (req, res) {
  var coinName = req.query.coin;
  // console.log(coinName);
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

app.listen(3000);
