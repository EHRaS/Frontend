var express = require('express');
var serveStatic = require('serve-static');
var compression = require('compression');
var https = require('https');
var http = require('http');
var fs = require('fs');
var heatlamp = require('express-heatlamp');

var app = express();

// app.use(heatlamp({ min: 168, max: 336 })); // 1 week to 2 weeks
app.use(compression());
app.use(express.static('public'));

http.createServer(app).listen(8080);

// https.createServer({
//   key: fs.readFileSync('ssl/key.key'),
//   cert: fs.readFileSync('ssl/cert.crt'),
//   ca: fs.readFileSync('ssl/bundle.ca-bundle')
// }, app).listen(8080);

console.log('EHRaS Frontend on :8080');
