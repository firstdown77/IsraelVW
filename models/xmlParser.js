var fs = require('fs');
var xml2js = require('xml2js');
var util = require('util');
var mongoClient = require("mongodb").MongoClient;

var server = "mongodb://localhost:27017/";

var doError = function (e) {
    util.debug("ERROR: "+e);
    throw new Error(e);
}

//Parses the Water Footprint Network appendix and inserts all entries into 
//a MongoDB database.  DB name: virtualwaterDB, collection: waterFootprintNetwork.
exports.doParse = function(req, res) {
  	var callback = function(model) {
	  	console.log("Result: " + model + " added");
  	}; //callback
    mongoClient.connect(server+"virtualwaterDB", function(err, db) {
    	if (err) doError(err);
		var parser = new xml2js.Parser();
		fs.readFile('./theXML2.xml', function(err, data) {
		    parser.parseString(data, function (err, result) {
				//console.log(util.inspect(result, false, null));
				var tableArray = result["TaggedPDF-doc"].Table;
				//var k is the current page number.
				for (var k = 0; k < tableArray.length; k++) {
					onePageArray = tableArray[k].TR;
					if (k % 3 == 0) {
						var elementsAdded = 0;
						var buildArray = [];
					}
					//var i is the current row on the page.
					for (var i = 0; i < onePageArray.length; i++) {
						var rowArray = onePageArray[i].TH;
						//If this is the commodity header line:
						if (rowArray[0] === 'Product >>> ' && k % 3 == 0) {
							for (var j = 1; j < rowArray.length; j++) {
								if (rowArray[j].length > 0) {
									buildArray.push(rowArray[j].trim());
								} //if
							} //for rowArray
						} //if
						//If this is a country specifying header line:
						else if (rowArray.length == 1) {
							var objectToSave = {};
							var objectToMatch = [];
							objectToMatch.country = rowArray[0].trim();
							var waterDataRow = onePageArray[i].TD;
							elementsAdded = 0;
							//var z is the current data string in the row.
							for (var z = 0; z < waterDataRow.length; z++) {
								currData = waterDataRow[z];
								//If the data is a real string:
								if (currData.length > 0 ) {
									if (elementsAdded % 3 == 0) {
										objectToSave.green = currData.trim();
									} //if
									else if (elementsAdded % 3 == 1) {
										objectToSave.blue = currData.trim();
									
									} //else if
									else if (elementsAdded % 3 == 2){
										objectToSave.grey = currData.trim();
									} //else if
									else {
										console.log("Color adding failed.");
									} //else
									elementsAdded++;
									if (elementsAdded % 3 == 0) {
								 	 	objectToMatch.commodity = buildArray[(elementsAdded / 3) - 1];
									    db.collection("tradeMap").update(objectToMatch, 
											{$set: objectToSave },
											{ multi: true }, function(err, crsr) {
										    if (err) doError(err);	
									        callback(crsr);
									  	}); //collection.save
									} //if	
								} //if currData.length
							} //for waterDataRow
						} //else if
					} //for onePageArray
				} //for tableArray
		    }); //parseString
		}); //readFile
	}); //mongoClient.connect
	return;
}