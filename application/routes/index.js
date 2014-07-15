var db = require('../models').db;

// render the index page
exports.index = function(req, res){
    res.render('events.ejs');
    res.end();
}

// render the events page
exports.events = function(req, res){
    if (req.query._pjax) res.render('events.ejs', {layout: 'false'});
    else res.render('events.ejs');
    res.end();
}

// render the tech page
exports.tech = function(req, res){
    if (req.query._pjax) res.render('tech.ejs', {layout: 'false'});
    else res.render('tech.ejs');
    res.end();
}

// render the trivia page
exports.trivia = function(req, res){
    if (!req.session.user) {
        if (req.query._pjax) res.render('login.ejs', {layout: 'false'});
        else res.render('login.ejs');
    }
    else {
        if (req.query._pjax) res.render('trivia.ejs', {layout: 'false'});
        else res.render('trivia.ejs');
    }
    res.end();
}

// render the connect page
exports.connect = function(req, res){
    if (!req.session.user) {
        if (req.query._pjax) res.render('login.ejs', {layout: 'false'});
        else res.render('login.ejs');
    }
    else {
        if (req.query._pjax) res.render('connect.ejs', {layout: 'false'});
        else res.render('connect.ejs');
    }
    res.end();
}

// render the profile page
exports.profile = function(req, res){
    if (!req.session.user) {
        if (req.query._pjax) res.render('login.ejs', {layout: 'false'});
        else res.render('login.ejs');
    }
    else {
        if (req.query._pjax) res.render('profile.ejs', {layout: 'false'});
        else res.render('profile.ejs');
    }
    res.end();
}

// render the register page
exports.register = function(req, res){
    if (req.query._pjax) res.render('register.ejs', {layout: 'false'});
    else res.render('register.ejs');
    res.end();
}

// render the login page
exports.login = function(req, res){
    if (req.query._pjax) res.render('login.ejs', {layout: 'false'});
    else res.render('login.ejs');
    res.end();
}
