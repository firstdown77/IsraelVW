var express = require('express')
  , http = require('http')
  , path = require('path')
  , xmlParser = require('./routes/xml_parser_controller')
  , txtParser = require('./routes/txt_parser_controller');
  
var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());	// Return a favicon if requested
  app.use(express.logger('tiny'));
  app.use(express.bodyParser());	// Parse the request body into req.body object
  app.use(express.methodOverride()); // Allows you to override HTTP methods on old browsers
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(express.errorHandler());
});

app.get('/parseXMLRequest', xmlParser.doParsing);
app.get('/parseTXTRequest', txtParser.doParsing);

var server = http.createServer(app);
server.listen(5555, function(){
  console.log("Express server listening on port 5555");
});