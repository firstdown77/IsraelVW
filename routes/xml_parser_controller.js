var model = require("../models/xmlParser.js");

exports.doParsing = function(req, res) {
    model.doParse();
    res.send(200);
};
