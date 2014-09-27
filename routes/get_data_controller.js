var model = require("../models/virtualWaterData.js");

exports.getData = function(req, res) {
    model.getVirtualWaterData({
		commodity: req.query.commodity, 
		year: req.query.year,
		color: req.query.color
	}, function(model) {
    	res.send(200, model);
    }); 
};

exports.getChartData = function(req, res) {
	model.allDataCountryCommodity({
		commodity: req.query.commodity,
		countries: req.query.countries,
		color: req.query.color
	}, function(model) {
    	res.send(200, model);
    });
}