var model = require("../models/txtParser.js");

exports.doParsing = function(req, res) {
    model.doParse();
    res.send(200);
};

exports.doParsingExports = function(req, res) {
    model.doParseExports();
    res.send(200);
};