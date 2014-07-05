var express = require('express')
  , http = require('http')
  , path = require('path')
  , xmlParser = require('./routes/xml_parser_controller')
  , txtParser = require('./routes/txt_parser_controller')
  , virtualWaterData = require('./routes/get_data_controller');
  
var app = express();

app.configure(function(){
  app.set('views', __dirname + '/views');
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
app.get('/virtualWaterRequest', virtualWaterData.getData);
app.get('/commodityRequest', virtualWaterData.getCurrentCommodity);
app.post('/commoditySetRequest', virtualWaterData.setCurrentCommodity);
app.get('/yearRequest', virtualWaterData.getCurrentYear);
app.post('/yearSetRequest', virtualWaterData.setCurrentYear);
app.get('/colorRequest', virtualWaterData.getCurrentColor);
app.post('/colorSetRequest', virtualWaterData.setCurrentColor);
app.get('/parseExportsRequest', txtParser.doParsingExports);



var server = http.createServer(app);
server.listen(4000, function(){
  console.log("Express server listening on port 4000");
});