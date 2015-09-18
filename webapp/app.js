var express = require('express');
var https = require('https');
var fs = require('fs');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');
var Datastore = require('nedb');

var app = express();
app.use(express.static(path.join(__dirname, 'public')));

var protocol = process.argv[2] || "http"
var port = protocol === "https" ? 443 : 80;

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('*', function(req, res) {
  res.sendFile('./public/index.html');
});

//=========================================
//TODO: npm install bcrypt --save
//TODO: install Visual C++ VCBuild.exe (.NET Framework 2.0)
var ds = new Datastore({filename: './users.db', autoload: true});
//=========================================

if(protocol === "https") {
  https.createServer({
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
  },app).listen(port);
} else {
  app.listen(port);
}
console.log("Server running: "+protocol+"://localhost");

module.exports = app;
