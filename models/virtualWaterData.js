var util = require('util');
var mongoClient = require("mongodb").MongoClient;

var server = "mongodb://localhost:27017/";

var doError = function (e) {
    util.debug("ERROR: "+e);
    throw new Error(e);
}

var arrayToSend = [];
var completeArrayLength = 5;
var currentCommodity = "Rice (Milled Equivalent)";
var currentYear = "2012";
var currentColor = "Green";

exports.getCurrentCommodity = function() {
	return currentCommodity;
}

exports.setCommodity = function(comToSet) {
	currentCommodity = comToSet;
}

exports.getCurrentYear = function() {
	return currentYear;
}

exports.setYear = function(yearToSet) {
	currentYear = yearToSet;
}

exports.getCurrentColor = function() {
	return currentColor;
}

exports.setColor = function(colorToSet) {
	currentColor = colorToSet;
}

exports.getVirtualWaterData = function(req, callback) {
	arrayToSend = [];
	completeArrayLength = 5;
	var com = currentCommodity = req.commodity;
	var currYear = currentYear = req.year;
	var currColor = currentColor = req.color;
	if (com === "All" || com === "Vegetables") {
		aggregateDataAndCalculate({
			commodity: com,
			year: currYear,
			color: currColor.toLowerCase()
		})
	}
	else {
		getDataAndCalculate({
			commodity: com,
			year: currYear,
			color: currColor.toLowerCase()
		});
	}

	var _flagCheck = setInterval(function() {
	    if (arrayToSend.length == completeArrayLength) {
	        clearInterval(_flagCheck);
			arrayToSend = arrayToSend.sort(function(a,b){
				return b[3]-a[3];
			});
	        callback(arrayToSend); // the function to run once all flags are true
	    }
	}, 100); // interval set at 100 milliseconds
}

function getDataAndCalculate(toFind) {
  	var callback = function(model) {
		for (var i = 0; i < model.length; i++) {
			var curr = model[i];
			if (curr.country !== "British Virgin Islands" &&
			 curr.country !== "Singapore" && curr.country !== "CC4te d\'Ivoire"
			 && curr.country !== "Hong Kong, China") {
			var data;
			if (toFind.color !== "all") {
				//data+toFind.year could be i.e. data2010
				data = curr["data"+toFind.year] * curr[toFind.color];
				var multiplied = addCommaSeparator(data.toString());
				console.log("" + curr.country + ": " + addCommaSeparator(curr["data"+toFind.year].toString()) + " tons * " + addCommaSeparator(curr[toFind.color].toString()) + " m^3/tons = " + multiplied);
			}
			else {
				data = curr["data"+toFind.year] * (parseInt(curr['green']) + parseInt(curr['blue']) + parseInt(curr['grey']));
				console.log(curr["data"+toFind.year]);
				console.log(curr['green']);
			}
			arrayToSend.push([curr.country, curr["data"+toFind.year], parseInt(curr[toFind.color]), data]);
			}
			else {
				completeArrayLength--;
				console.log("XML does not contain " + curr.country + " - " + curr["data"+toFind.year] + " tons.");
			}
		} //for
	}; //callback
// For terminal startup use:
	var dbCall = {
		commodity: toFind.commodity
	};
  	mongoClient.connect(server+"virtualwaterDB", function(err, db) {
		if (err) doError(err);
		var currYear = toFind.year;
		if (currYear === '2009') {
			var crsr = db.collection("tradeMap").find(dbCall).sort({data2009: -1}).limit(5);
		} //if
		else if (currYear === '2010') {
			var crsr = db.collection("tradeMap").find(dbCall).sort({data2010: -1}).limit(5);
		} //else if
		else if (currYear === '2011') {
			var crsr = db.collection("tradeMap").find(dbCall).sort({data2011: -1}).limit(5);
		} //else if
		else if (currYear === '2012') {
			var crsr = db.collection("tradeMap").find(dbCall).sort({data2012: -1}).limit(5);
		} //else if
		else {
			doError("Query tradeMap failed.");
		} //else
		crsr.toArray(function(err, docs) {
		    if (err) doError(err);
		    callback(docs);
		});
    }); //mongoClient
}

function addCommaSeparator(strNumber) {
	return strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}