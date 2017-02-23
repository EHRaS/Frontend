var express = require('express');
var serveStatic = require('serve-static');
var compression = require('compression');
var https = require('https');
var http = require('http');
var fs = require('fs');

var app = express();

app.use(compression());
app.use(express.static('public'))

http.createServer(app).listen(8080);

// https.createServer({
//   key: fs.readFileSync('ssl/key.key'),
//   cert: fs.readFileSync('ssl/cert.crt'),
//   ca: fs.readFileSync('ssl/bundle.ca-bundle')
// }, app).listen(8080);

console.log('Listening on :8080');
