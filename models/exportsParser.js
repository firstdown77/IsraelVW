var fs = require('fs');
var util = require('util');
var path = require('path');
var mongoClient = require("mongodb").MongoClient;

var server = "mongodb://localhost:27017/";

var doError = function (e) {
    util.debug("ERROR: "+e);
    throw new Error(e);
}

//Parses all the TradeMap.org text files and inserts all entries into 
//a MongoDB database.  DB name: virtualwaterDB, collection: tradeMap.
exports.doParseExports = function(req, res) {
  	var callback = function(model) {
	  	console.log("Result: " + model + " added");
  	}; //callback
    mongoClient.connect(server+"virtualwaterDB", function(err, db) {
    	if (err) doError(err);
		db.dropCollection("tradeMap", function(err, db) {
			if (err) console.log("The tradeMap table probably did not previously exist.");
			console.log("tradeMap cleared");
		});
		fs.readdir('./exports', function(err, files) {
			if (err) throw err;
			for (var j = 0; j < files.length; j++) {
				var txtIndex = files[j].indexOf(".txt");
				var currCommodity = (files[j]).substring(0, txtIndex);
				if (txtIndex !== -1) {
					// readFile is syncronous so that currCommodity is accurate
					// during database insertion.  Otherwise, currCommodity would
					// always be files[last_element].
					var data = fs.readFileSync('./exports/' + files[j], "ascii") //,function(err, data) {
						//if (err) throw err;
						lineArr = data.trim().split("\n");
						var limit = lineArr.length;
						var i = 2;
						var currLine = lineArr[i].split("\t");
						var currCountry = currLine[0];
						var currTotals = currLine.splice(1,4);
						var objectToInsert = {};
						var objectToUpdate = {};
						objectToInsert.export2009 = parseInt(currTotals[0].replace("No Quantity", '0').replace(/\,/g,''));
						objectToInsert.export2010 = parseInt(currTotals[1].replace("No Quantity", '0').replace(/\,/g,''));
						objectToInsert.export2011 = parseInt(currTotals[2].replace("No Quantity", '0').replace(/\,/g,''));
						objectToInsert.data2012 = parseInt(currTotals[3].replace("No Quantity", '0').replace(/\,/g,''));
						objectToUpdate.commodity = currCommodity;
						objectToUpdate.country = currCountry;
						db.collection("tradeMap").update(objectToUpdate, 
							{$set: objectToInsert }, {multi:true}, function(err, crsr) {
						    if (err) doError(err);	
						       callback(crsr);
						  }); //collection.update
					//}); //readFile
				} //if
			} //for
		}); //readdir
	}); //mongoClient.connect
} //doParse