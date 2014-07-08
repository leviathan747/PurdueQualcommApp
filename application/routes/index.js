var db = require('../models').db;

// render the index page
exports.index = function(req, res){
    res.render('index.ejs');
    res.end();
}

// render the intern app example page
exports.internApp = function(req, res){
    res.render('intern.ejs');
    res.end();
}
