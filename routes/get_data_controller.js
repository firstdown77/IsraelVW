var model = require("../models/virtualWaterData.js");
var async = require('async');


exports.getData = function(req, res) {
    model.getVirtualWaterData({commodity: req.query.commodity, year: req.query.year}, function(model) {
    	res.send(200, model);
    }); 
};
	/*
	var _flagCheck = setInterval(function() {
	    if (requestedArray !== undefined) {
	        clearInterval(_flagCheck);
			console.log("Apparent Success Again");
			console.log(arrayToSend);
		    res.send(200, requestedArray); // the function to run once all flags are true
	    }
	}, 1000); // interval set at 100 milliseconds
	*/
	//};
