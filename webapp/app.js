var express = require('express');
var Server = require('socket.io');
var http = require('http');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var favicon = require('serve-favicon');

var https = require('https');
var fs = require('fs');

var Datastore = require('nedb');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));

var protocol = process.argv[2] || "http"
var port = protocol === "https" ? 443 : 80;

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.get('*', function(req, res) {
  res.sendFile('./public/index.html');
});

//=========================================
var ds = new Datastore({filename: './users.db', autoload: true});
//=========================================

var appServer;
if(protocol === "https") {
  appServer = https.createServer({
    key: fs.readFileSync('../key.pem'),
    cert: fs.readFileSync('../cert.pem')
  },app);
} else {
  appServer = http.createServer(app);
}
var io = new Server(appServer);
appServer.listen(port);

io.on('connection', function(socket) {
  socket.join('console');
  console.log("a user has connected");
});
console.log("Server running: "+protocol+"://localhost");

module.exports = app;
