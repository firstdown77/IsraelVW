var fs = require('fs');
var util = require('util');
var path = require('path');
var mongoClient = require("mongodb").MongoClient;

var server = "mongodb://localhost:27017/";


//Parses all the TradeMap.org text files and inserts all entries into 
//a MongoDB database.  DB name: virtualwaterDB, collection: tradeMap.
exports.doParse = function(req, res) {
  	var callback = function(model) {
	  	console.log('added!');
  	}; //callback
	var no2012Values = ["Tobacco", "Wine", "Rubber", "Eggs + (Total)", "Tea", "Beer"];
    mongoClient.connect(server+"virtualwaterDB", function(err, db) {
    	if (err) doError(err);
		/*db.dropCollection("tradeMap", function(err, db) {
			if (err) doError(err);
			console.log("tradeMap cleared");
		});*/
		fs.readdir('./TM', function(err, files) {
			if (err) throw err;
			for (var j = 0; j < files.length; j++) {
				var txtIndex = files[j].indexOf(".txt");
				var currCommodity = (files[j]).substring(0, txtIndex);
				var has2012 = true;
				for (var k = 0; k < no2012Values.length; k++) {
					if (currCommodity === no2012Values[k]) {
						has2012 = false;
					} //if
				} //for
				if (txtIndex !== -1) {
					// readFile is syncronous so that currCommodity is accurate
					// during database insertion.  Otherwise, currCommodity would
					// always be files[last_element].
					var data = fs.readFileSync('./TM/' + files[j], "ascii") //,function(err, data) {
						//if (err) throw err;
						lineArr = data.trim().split("\n");
						var limit;
						if (lineArr.length > 8) {
							limit = 8;
						} //if
						else {
							limit = lineArr.length
						} //else
						for (var i = 3; i < limit; i++) {
							var currLine = lineArr[i].split("\t");
							var currCountry = currLine[0];
							var currTotals = currLine.splice(1,4);
							objectToInsert = {}
							objectToInsert.data2009 = currTotals[0];
							objectToInsert.data2010 = currTotals[1];
							objectToInsert.data2011 = currTotals[2];
							if (has2012) objectToInsert.data2012 = currTotals[3];
							objectToInsert.commodity = currCommodity;
							objectToInsert.country = currCountry;
						    db.collection("tradeMap").save(objectToInsert, 
								{safe:true}, function(err, crsr) {
						        callback(crsr);
						  	}); //collection.save
						} //for
						//}); //readFile
				} //if
			} //for
		}); //readdir
	}); //mongoClient.connect
} //doParse