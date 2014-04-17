var fs = require('fs');
var xml2js = require('xml2js');
var util = require('util');
var mongoClient = require("mongodb").MongoClient;

var server = "mongodb://localhost:27017/";

var doError = function (e) {
    util.debug("ERROR: "+e);
    throw new Error(e);
}

function find(toFind, callback) {
// For terminal startup use:
  	mongoClient.connect(server+"virtualwaterDB", function(err, db) {
		if (err) doError(err);
		var crsr = db.collection("country").find(toFind);
		crsr.toArray(function(err, docs) {
		    if (err) doError(err);
		    callback(docs);
		});
    });
}

//Parses the Water Footprint Network appendix and inserts all entries into 
//a MongoDB database.  DB name: virtualwaterDB, collection: waterFootprintNetwork.
exports.doParse = function(req, res) {
  	var callback = function(model) {
	  	console.log('added!');
  	}; //callback
    mongoClient.connect(server+"virtualwaterDB", function(err, db) {
    	if (err) doError(err);
		db.dropCollection("waterFootprintNetwork", function(err, db) {
			if (err) doError(err);
			console.log("waterFootprintNetwork cleared");
		});
		var parser = new xml2js.Parser();
		fs.readFile('./theXML2.xml', function(err, data) {
		    parser.parseString(data, function (err, result) {
				//console.log(util.inspect(result, false, null));
				var tableArray = result["TaggedPDF-doc"].Table;
				for (var k = 0; k < tableArray.length; k++) {
					onePageArray = tableArray[k].TR;
					if (k % 3 == 0) var buildArray = [];
					for (var i = 0; i < onePageArray.length; i++) {
						var rowArray = onePageArray[i].TH;
						if (rowArray[0] === 'Product >>> ' && k % 3 == 0) {
							for (var j = 1; j < rowArray.length; j++) {
								if ((rowArray[j]).length > 0) {
									buildArray.push(rowArray[j]);
								} //if
							} //for rowArray
						} //if
						else if (rowArray.length == 1) {
							var objectToSave = {}
							var currCountry = rowArray[0];
							objectToSave.country = currCountry;
							var waterDataRow = onePageArray[i].TD;
							var arrayToInsert = []
							for (var z = 0; z < waterDataRow.length; z++) {
								currData = waterDataRow[z];
								var currColor;
								if (arrayToInsert.length % 3 == 0) {
									currColor = 'green';
								} //if
								else if (arrayToInsert.length % 3 == 1) {
									currColor = 'blue';
								} //else if
								else {
									currColor = 'grey'
								} //else
								if (currData.length > 0 ) {
									arrayToInsert.push({
										 color: currColor,
										 virtualWaterQuantity: currData,
									 }); //push
								} //if
								if (arrayToInsert.length == 3) {
							 	 	objectToSave.commodity = 
									buildArray[Math.floor(arrayToInsert.length / 3)];
									objectToSave.waterData = arrayToInsert;
								    db.collection("waterFootprintNetwork").save(objectToSave, 
										{safe:true}, function(err, crsr) {
								        callback(crsr);
								  	}); //collection.save
									arraytoInsert = [];
								} //if
							} //for waterDataRow
						} //else if
					} //for onePageArray
				} //for tableArray
		    }); //parseString
		}); //readFile
	}); //mongoClient.connect
	return;
}