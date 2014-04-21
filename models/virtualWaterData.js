var util = require('util');
var async = require('async');
var mongoClient = require("mongodb").MongoClient;

var server = "mongodb://localhost:27017/";

var doError = function (e) {
    util.debug("ERROR: "+e);
    throw new Error(e);
}

var arrayToSend = [];

exports.getVirtualWaterData = function(req, callback) {
	arrayToSend = [];
	var com = req.commodity;
	var currYear = req.year;
	findTXT({
		//TODO
		commodity: com,
		year: currYear
	});
	var _flagCheck = setInterval(function() {
	    if (arrayToSend.length == 5) {
	        clearInterval(_flagCheck);
	        callback(arrayToSend); // the function to run once all flags are true
	    }
	}, 100); // interval set at 100 milliseconds
	/*
	async.detect([arrayToSend], isOfLength, function(result){
		console.log("Apparent success");
		console.log(arrayToSend);
		return result;
	    // result now equals the first file in the list that exists
	});*/
	/*
	async.whilst(
	    function () { return arrayToSend.length < 5; },
	    function (callback) {
	        setTimeout(callback, 150000);
			console.log("Inside whilst: " + arrayToSend);
			//res.send(200, arrayToSend);
			return arrayToSend;
	    },
	    function (err) {
	        // 5 seconds have passed
	    }
	);
	*/
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
		//console.log(findXMLObject);
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
				arrayToSend.push("" + currCountry + ": " + addCommaSeparator(data1) + " tons * " + addCommaSeparator(data2) + " m^3/tons = " + multiplied);
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
			if (dbCall.country !== "British Virgin Islands" &&
			 dbCall.country !== "Singapore" && dbCall.country !== "CC4te d\'Ivoire"
			 && dbCall.country !== "Hong Kong, China") {
				var crsr = db.collection("waterFootprintNetwork").find(dbCall);
				crsr.toArray(function(err, docs) {
				    if (err) doError(err);
				    callback(docs);
				});
			} //if dbCall.country
			else {
				arrayToSend.push("XML does not contain " + dbCall.country + " - " + toFind.data[i].data + " tons.");
			}
		}
    });
}

function addCommaSeparator(strNumber) {
	return strNumber.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}