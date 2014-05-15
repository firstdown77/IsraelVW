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

exports.getCurrentCommodity = function(req, res) {
	res.send(200, model.getCurrentCommodity());
}

exports.setCurrentCommodity = function(req, res) {
	model.setCommodity(req.query.commodity);
	res.send(200);
}

exports.getCurrentYear = function(req, res) {
	res.send(200, model.getCurrentYear());
}

exports.setCurrentYear = function(req, res) {
	model.setYear(req.query.year);
	res.send(200);
}

exports.getCurrentColor = function(req, res) {
	res.send(200, model.getCurrentColor());
}

exports.setCurrentColor = function(req, res) {
	model.setColor(req.query.color);
	res.send(200);
}