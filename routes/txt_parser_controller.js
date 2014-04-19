var model = require("../models/txtParser.js");

exports.doParsing = function(req, res) {
    model.doParse();
    res.send(200);
};