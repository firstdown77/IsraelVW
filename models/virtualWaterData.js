var util = require('util');

var mongodb = require('mongodb');
var db = new mongodb.Db('nodejitsudb123536169',
		new mongodb.Server('troup.mongohq.com', 10091, {}), {safe:true}
);

db.open(function(err, db_p) {
	if (err) {
		throw err;
	}
	db.authenticate('nodejitsu', '87d68fa2a3f25410f3d7a22c2d3881e2', function (err, replies) {
		// You are now connected and authenticated.
	});
});

var doError = function (e) {
	util.debug(e);
	throw new Error(e);
}

var averageCosts = [["Coffee", "There are 140 liters of virtual water per cup of coffee."],
                    ["Bovine Meat", "There are 15,500 liters of virtual water per kilogram of beef."],
                    ["Cheese", "There are 5,000 liters of virtual water per kilogram of cheese."],
                    ["Millet", "There are 5,000 liters of virtual water per kilogram of millet."],
                    ["Mutton & Goat Meat", "There are 10,412 liters of virtual water per kilogram of sheep meat."],
                    ["Rice (Milled Equivalent)", "There are 3,400 liters of virtual water per kilogram of rice."],
                    ["Rubber", "There are 5923 liters of virtual water per pound of natural rubber."],
                    ["Soyabeans", "There are 1,800 liters of virtual water per kilogram of soyabeans."],
                    ["Sugar Beet", "There are 920 liters of virtual water per kilogram of sugar beet."],
                    ["Sugar Cane", "There are 1,782 liters of virtual water per kilogram of sugar cane."],
                    ["Sorghum", "There are 1,400 liters of virtual water per pound of sorghum."],
                    ["Wheat", "There are 1,300 liters of virtual water per kilogram of wheat."],
                    ["Barley", "There are 1,300 liters of virtual water per kilogram of barley."],
                    ["Maize", "There are 900 liters of virtual water per kilogram of maize."],
                    ["Apples", "There are 70 liters of virtual water per apple."],
                    ["Butter, Ghee", "There are 5,553 liters of virtual water per kilogram of butter."],
                    ["Eggs + (Total)", "There are 200 liters of virtual water per egg."],
                    ["Sweeteners, Other", "There are 28 liters of virtual water per pound of candy."],
                    ["Groundnuts (Shelled Eq)", "There are 2,782 liters of virtual water per kilogram of groundnuts."],
                    ["Nuts", "There are 981 liters of virtual water per cup of almonds."],
                    ["Cream", "There are 255 liters of virtual water per 250 ml glass of milk."],
                    ["Olives", "There are 3,015 liters of virtual water per kilogram of olives."],
                    ["Onions", "There are 97 liters of virtual water per pound of onions."],
                    ["Potatoes", "There are 287 liters per kilogram of potatoes."],
                    ["Tea", "There are 30 liters of virtual water per cup of tea."],
                    ["Coconuts - Incl Copra", "There are 1,215 liters of virtual water per coconut."],
                    ["Grapes", "There are 115 liters of virtual water per pound of grapes."],
                    ["Rye", "There are 150 liters of virtual water per pound of rye."],
                    ["Oats", "There are 78 liters of virtual water per cup of ats."],
                    ["Pepper", "There are 2,230 liters of virtual water per pound of black pepper."]];

//var population = [["2012", "7910500"],
//["2011", "7765800"],
//["2010", "7623600"],
//["2009", "7485600"],
//["2008", "7308800"],
//["2007", "7180100"],
//["2006", "7053700"],
//["2005", "6930100"],
//["2004", "6809000"],
//["2003", "6689700"],
//["2002", "6570000"],
//["2001", "6439000"]];

var completeArrayLength = 6;
var currentCommodity = "Rice (Milled Equivalent)";
var currentYear = "2012";
var currentColor = "Green";

exports.getVirtualWaterData = function(req, callback) {
	arrayToSend = [];
	completeArrayLength = 6;
	var com = currentCommodity = req.commodity;
	var currYear = currentYear = req.year;
	var currColor = currentColor = req.color;
	if (com === "All") {
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
		completeArrayLength = model.length;
		for (var i = 0; i < model.length; i++) {
			var curr = model[i];
			var data;
			if (curr.country === "Israel") {
				//data+toFind.year could be i.e. data2010
				data = convertToMCM(curr["export"+toFind.year] * curr[toFind.color], 3);
				arrayToSend.push([curr.country, curr["export"+toFind.year], convertToMCM(curr[toFind.color], 6), data]);
			} //if country is Israel
			else if (curr.country !== "British Virgin Islands" &&
					curr.country !== "Singapore" && curr.country !== "CC4te d\'Ivoire"
						&& curr.country !== "Hong Kong, China") {
				//data+toFind.year could be i.e. data2010
				data = convertToMCM(curr["data"+toFind.year] * curr[toFind.color], 3);
				if (data >= 0.001) {
					arrayToSend.push([curr.country, curr["data"+toFind.year], convertToMCM(curr[toFind.color], 6), data]);
				}
				else {
					completeArrayLength--;
				}
			} //else if curr.country !== British Virgin..
			else { //curr.country is something not in the db.
				completeArrayLength--;
			}
		} //for
	}; //callback
	var dbCall = {
			commodity: toFind.commodity
	};
	var colorObject = {};
	colorObject["" + toFind.color] = {$gt: 0};
	var currYear = toFind.year;
	if (currYear === '2001') {
		dbCall.$or = [{$and : [{data2001: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2001: -1, data2001: -1}).limit(6);
	} //if
	else if (currYear === '2002') {
		dbCall.$or = [{$and : [{data2002: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2002: -1, data2002: -1}).limit(6);
	} //else if
	else if (currYear === '2003') {
		dbCall.$or = [{$and : [{data2003: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2003: -1, data2003: -1}).limit(6);
	} //else if
	else if (currYear === '2004') {
		dbCall.$or = [{$and : [{data2004: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2004: -1, data2004: -1}).limit(6);
	} //else if
	else if (currYear === '2005') {
		dbCall.$or = [{$and : [{data2005: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2005: -1, data2005: -1}).limit(6);
	} //if
	else if (currYear === '2006') {
		dbCall.$or = [{$and : [{data2006: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2006: -1, data2006: -1}).limit(6);
	} //else if
	else if (currYear === '2007') {
		dbCall.$or = [{$and : [{data2007: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2007: -1, data2007: -1}).limit(6);
	} //else if
	else if (currYear === '2008') {
		dbCall.$or = [{$and : [{data2008: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2008: -1, data2008: -1}).limit(6);
	} //else if
	else if (currYear === '2009') {
		dbCall.$or = [{$and : [{data2009: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2009: -1, data2009: -1}).limit(6);
	} //if
	else if (currYear === '2010') {
		dbCall.$or = [{$and : [{data2010: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2010: -1, data2010: -1}).limit(6);
	} //else if
	else if (currYear === '2011') {
		dbCall.$or = [{$and : [{data2011: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2011: -1, data2011: -1}).limit(6);
	} //else if
	else if (currYear === '2012') {
		dbCall.$or = [{$and : [{data2012: {$gt: 0}}, colorObject]}, {country: "Israel"}]
		var crsr = db.collection("tradeMap3").find(dbCall).sort({export2012: -1, data2012: -1}).limit(6);
	} //else if
	else {
		doError("Query tradeMap3 failed.");
	} //else
	crsr.toArray(function(err, docs) {
		if (err) doError(err);
		callback(docs);
	});
}

function aggregateDataAndCalculate(toFind) {
	var projectObject = {};
	projectObject["country"] = 1;
	projectObject["data"+toFind.year] = 1;
	projectObject["" + toFind.color] = 1;
	projectObject["mult"] = {
			$multiply: ["$"+toFind.color, "$data"+toFind.year]
	}
	db.collection("tradeMap3").aggregate({
		$project: projectObject
	}, {
		$group: {
			_id: "$country",
			total: {
				$sum : "$mult"
			}, tons: {
				$sum: "$data"+toFind.year
			}, average: {
				$avg: "$"+toFind.color
			}
		}
	}, {
		$match: {
			total: {$gt: 0}
		}
	}, {
		$sort: {
			total: -1
		}
	}, {
		$limit: 5
	}, function(err, result){
		if (err) doError(err);
		for (var i = 0; i < result.length; i++) {
			arrayToSend.push([result[i]._id, result[i].tons, /*convertToMCM(result[i].average, 6)*/ (convertToMCM(result[i].total, 3)/result[i].tons).toFixed(6), convertToMCM(result[i].total, 3)]);
		}
	}
	);
	getIsraelToo(toFind);
}


function getIsraelToo(toFind){
	var projectObject2 = {};
	projectObject2["country"] = 1;
	projectObject2["export"+toFind.year] = 1;
	projectObject2["" + toFind.color] = 1;
	projectObject2["mult"] = {
			$multiply: ["$"+toFind.color, "$export"+toFind.year]
	}
	db.collection("tradeMap3").aggregate({
		$project: projectObject2
	}, {
		$group: {
			_id: "$country", total: {
				$sum : "$mult"
			}, tons: {
				$sum: "$export"+toFind.year
			}, average: {
				$avg: "$"+toFind.color
			}
		}
	}, { 
		$match : { 
			_id : "Israel" 
		} 
	}, function(err, result){
		if (err) doError(err);
		for (var i = 0; i < result.length; i++) {
			arrayToSend.push([result[i]._id, result[i].tons, /*convertToMCM(result[i].average, 6)*/ (convertToMCM(result[i].total, 3)/result[i].tons).toFixed(6), convertToMCM(result[i].total, 3)]);
		}
	});
}

exports.allDataCountryCommodity = function(req, callback) {
	arrayToSend = [];
	var color = req.color.toLowerCase();
	var countries = req.countries;
	var commodity = decodeURI(req.commodity);
	var matchObject;
	var projectOrGroupObject;
	if (commodity !== 'All') {
		var crsr = db.collection("tradeMap3").aggregate(
				[
				 { $match: {
					 country: { $in: countries },
					 commodity: commodity
				 }
				 },
				 { $project: {
					 country: 1,
					 total2001: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2001", "$"+color, .000001]
						 }, { $multiply: ["$data2001", "$"+color, .000001]}]
					 },
					 total2002: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2002", "$"+color, .000001]
						 }, { $multiply: ["$data2002", "$"+color, .000001]}]
					 },
					 total2003: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2003", "$"+color, .000001]
						 }, { $multiply: ["$data2003", "$"+color, .000001]}]
					 },
					 total2004: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2004", "$"+color, .000001]
						 }, { $multiply: ["$data2004", "$"+color, .000001]}]
					 },
					 total2005: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2005", "$"+color, .000001]
						 }, { $multiply: ["$data2005", "$"+color, .000001]}]
					 },
					 total2006: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2006", "$"+color, .000001]
						 }, { $multiply: ["$data2006", "$"+color, .000001]}]
					 },
					 total2007: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2007", "$"+color, .000001]
						 }, { $multiply: ["$data2007", "$"+color, .000001]}]
					 },
					 total2008: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2008", "$"+color, .000001]
						 }, { $multiply: ["$data2008", "$"+color, .000001]}]
					 },
					 total2009: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2009", "$"+color, .000001]
						 }, { $multiply: ["$data2009", "$"+color, .000001]}]
					 },
					 total2010: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2010", "$"+color, .000001]
						 }, { $multiply: ["$data2010", "$"+color, .000001]}]
					 },
					 total2011: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2011", "$"+color, .000001]
						 }, { $multiply: ["$data2011", "$"+color, .000001]}]
					 },
					 total2012: { 
						 $cond: [{ $eq: ["$country", 'Israel']}, {
							 $multiply: ["$export2012", "$"+color, .000001]
						 }, { $multiply: ["$data2012", "$"+color, .000001]}]
					 }
				 }},
				 { $sort : { country : 1}
				 }
				 ], function(err, result) {
					if (err) doError(err);
					for (var i = 0; i < result.length; i++) {
						//Swap Israel data to front of array:
						if (result[i].country === 'Israel') {
							var temp = result[i]; //must === 'Israel'
							result[i] = result[0];
							result[0] = temp;
						}
					}
					arrayToSend.push(result);
				}
		);
	} else { //i.e. commodity === 'All'
		var crsr = db.collection("tradeMap3").aggregate(
				[
				 { $match: {
					 country: { $in: countries }
				 }
				 },
				 { $group: {
					 _id: '$country', 
					 total2001: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2001", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2001", "$"+color, .000001]
					 }]}},
					 total2002: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2002", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2002", "$"+color, .000001]
					 }]}},
					 total2003: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2003", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2003", "$"+color, .000001]
					 }]}},
					 total2004: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2004", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2004", "$"+color, .000001]
					 }]}},
					 total2005: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2005", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2005", "$"+color, .000001]
					 }]}},
					 total2006: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2006", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2006", "$"+color, .000001]
					 }]}},
					 total2007: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2007", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2007", "$"+color, .000001]
					 }]}},
					 total2008: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2008", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2008", "$"+color, .000001]
					 }]}},
					 total2009: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2009", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2009", "$"+color, .000001]
					 }]}},
					 total2010: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2010", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2010", "$"+color, .000001]
					 }]}},
					 total2011: {$sum: 
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2011", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2011", "$"+color, .000001]
					 }]}},
					 total2012: {$sum:
					 {$cond: [{ $eq: ['$country', "Israel"]}, {
						 $multiply: ["$export2012", "$"+color, .000001]
					 }, {
						 $multiply: ["$data2012", "$"+color, .000001]
					 }]}}
				 }},
				 { $sort : { _id : 1}
				 }
				 ], function(err, result) {
					if (err) doError(err);
					for (var i = 0; i < result.length; i++) {
						//Swap Israel data to front of array:
						if (result[i]._id === 'Israel') {
							var temp = result[i]; //must === 'Israel'
							result[i] = result[0];
							result[0] = temp;
						}
					}
					arrayToSend.push(result);
				}
		);

	}

	var _flagCheck = setInterval(function() {
		if (arrayToSend.length == 1) {
			clearInterval(_flagCheck);
			callback(arrayToSend[0]); // the function to run once all flags are true
		}
	}, 100); // interval set at 100 milliseconds
}

exports.getCommodityInfo = function(req, callback) {
	var commodity = decodeURI(req.commodity);
	for (var i = 0; i < averageCosts.length; i++) {
		if (averageCosts[i][0] === commodity) {
			callback(averageCosts[i][1]);
		}
	}
	return null;
}

//Converts a cubic meter value into a millions cubic meter value.
function convertToMCM(toConvert, decimalPoints) {
	var MILLIONSCMCONVERSION = 1000000;
	return parseFloat((toConvert/MILLIONSCMCONVERSION).toFixed(decimalPoints));
}