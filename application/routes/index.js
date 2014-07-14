var db = require('../models').db;

// render the index page
exports.index = function(req, res){
    res.render('events.ejs');
    res.end();
}

// render the events page
exports.events = function(req, res){
    res.render('events.ejs');
    res.end();
}

// render the tech page
exports.tech = function(req, res){
    res.render('tech.ejs');
    res.end();
}

// render the trivia page
exports.trivia = function(req, res){
    res.render('trivia.ejs');
    res.end();
}

// render the connect page
exports.connect = function(req, res){
    res.render('connect.ejs');
    res.end();
}

// render the profile page
exports.profile = function(req, res){
    res.render('profile.ejs');
    res.end();
}
