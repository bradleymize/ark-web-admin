var express = require('express');
var https = require('https');
var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

var port = 9000;

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('*', function(req, res) {
  res.sendFile('./public/index.html');
});

//app.listen(port); //http

// https://letsencrypt.org/howitworks/
var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
}
//TODO: if env = dev, self-sign certificate
https.createServer(options,app).listen(443);
console.log("Server running: https://localhost:"+port);

module.exports = app;
