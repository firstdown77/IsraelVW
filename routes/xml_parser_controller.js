var model = require("../models/xmlParser.js");

exports.doParsing = function(req, res) {
    var theAnswer = model.doParse();
    res.send(200);
};
