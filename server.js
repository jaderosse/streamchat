var express = require('express');
var fs = require('fs');
var path = require('path');
var pug = require('pug');
var app = express();

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');

app.get('/', function (req, res) {
  res.render('index');
});

app.listen(3000);