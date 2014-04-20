var model = require("../models/virtualWaterData.js");

exports.getData = function(req, res) {
    model.getVirtualWaterData({commodity: req.query.commodity, year: req.query.year});
    res.send(200);
};
