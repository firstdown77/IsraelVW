var model = require("../models/txtParser.js");

exports.doParsing = function(req, res) {
    var theAnswer = model.doParse();
    res.send(200);
};