var express = require('express');
var body_parser = require('body-parser');
var auth_google = require('./auth-google');

var app = module.exports = express();

app.use(body_parser());
app.use(express.static('public'));

auth_google(app)

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});