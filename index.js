var express = require('express');
var serveStatic = require('serve-static');
var compression = require('compression');
var https = require('https');
var http = require('http');
var fs = require('fs');
var heatlamp = require('express-heatlamp');
var hbs = require('hbs');

var app = express();

// app.use(heatlamp({ min: 168, max: 336 })); // 1 week to 2 weeks
app.use(compression());
app.use(express.static('public'));

// app.set('view engine', 'html');
// app.engine('html', hbs.__express);
// app.set('views', __dirname + "/public");
// hbs.registerPartials(__dirname + "/public/partials");

// app.get('/', function(req, res){
//   res.render('index.html', {}, function(err, html){
//       if(err) console.error(err + __dirname);
//   });
// });
http.createServer(app).listen(8080);

// https.createServer({
//   key: fs.readFileSync('ssl/key.key'),
//   cert: fs.readFileSync('ssl/cert.crt'),
//   ca: fs.readFileSync('ssl/bundle.ca-bundle')
// }, app).listen(8080);

console.log('Listening on :8080');
