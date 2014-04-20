var util = require('util');
var mongoClient = require("mongodb").MongoClient;

var server = "mongodb://localhost:27017/";

var doError = function (e) {
    util.debug("ERROR: "+e);
    throw new Error(e);
}

var classRes;

exports.getVirtualWaterData = function(req, res) {
	var com = req.commodity;
	var currYear = req.year;
	findTXT({
		//TODO
		commodity: "Rice (Milled Equivalent)",
		year: '2012'
	});
}

function findTXT(toFind) {
  	var callback = function(model) {
		var dataArray = [];
		for (var i = 0; i < model.length; i++) {
			var objectToPush = {};
			var year = toFind.year;
			var data;
			if (year === '2009') {
				data = model[i].data2009;
			} //if
			else if (year === '2010') {
				data = model[i].data2010;
			} //else if
			else if (year === '2011') {
				data = model[i].data2011;
			} //else if
			else if (year === '2012') {
				data = model[i].data2012;
			} //else if
			else {
				console.log("Get data failed.")
			} //else
			objectToPush.country = model[i].country;
			objectToPush.data = data;
			dataArray.push(objectToPush);
		} //for
		var findXMLObject = {
			commodity: model[0].commodity,
			data: dataArray
		};
		console.log(findXMLObject);
		findXML(findXMLObject); //findXML
	}; //callback
// For terminal startup use:
	var dbCall = {
		commodity: toFind.commodity
	};
  	mongoClient.connect(server+"virtualwaterDB", function(err, db) {
		if (err) doError(err);
		var crsr = db.collection("tradeMap").find(dbCall);
		crsr.toArray(function(err, docs) {
		    if (err) doError(err);
		    callback(docs);
		});
    });
}

function findXML(toFind) {
  	var callback = function(model) {
		//model has the green virtual water data.  toFind has the quantities for 5 countries.
		//Should print 5 sets of data.
		var multipliedArray = [];
		var data2 = model[0].green;
		for (var j = 0; j < toFind.data.length; j++) {
			if (toFind.data[j].country === model[0].country) {
				var data1 = toFind.data[j].data.replace(/\,/g,'');
				var currCountry = toFind.data[j].country;
				var multiplied = addCommaSeparator((data1 * data2).toString());
				console.log("" + currCountry + ": " + addCommaSeparator(data1) + " * " + addCommaSeparator(data2) + " = " + multiplied);
			}
		}
	}; //callback
// For terminal startup use:
  	mongoClient.connect(server+"virtualwaterDB", function(err, db) {
		if (err) doError(err);
		//for each of the 5 countries:
		for (var i = 0; i < toFind.data.length; i++) {
			var dbCall = {
				country: toFind.data[i].country,
				commodity: toFind.commodity
			}; //var dbCall
			if (dbCall.country !== "British Virgin Islands") {
				var crsr = db.collection("waterFootprintNetwork").find(dbCall);
				crsr.toArray(function(err, docs) {
				    if (err) doError(err);
				    callback(docs);
				});
			} //if dbCall.country
			else {
				console.log("XML does not contain " + dbCall.country + " - " + toFind.data[i].data + " tons.");
			}
		}
    });
}

function addCommaSeparator(strNumber) {
	return strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}