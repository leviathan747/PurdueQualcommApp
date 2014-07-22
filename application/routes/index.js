var db = require('../models').db;

// render the index page
exports.index = function(req, res){
    var context = {
        user: req.session.user
    }
    res.render('events.ejs', context);
    res.end();
}

// render the events page
exports.events = function(req, res){
    var context = {
        user: req.session.user
    }

    res.render('events.ejs', context);
    res.end();
}

// render the tech page
exports.tech = function(req, res){
    var context = {
        user: req.session.user
    }

    res.render('tech.ejs', context);
    res.end();
}

// render the trivia page
exports.trivia = function(req, res){
    var context = {
        user: req.session.user,
        questions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
    }
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }

    res.render('trivia.ejs', context);
    res.end();
}

exports.trivia_question = function(req, res) {
    // "/trivia/<id>
    var id = Number(req.params.id);
    if (!id) {
        res.redirect("/trivia");
        return;
    }

    var question = {
        id: id,
        question: "here's the question",
        a: "answer a",
        b: "answer b",
        c: "answer c",
        d: "answer d"
    }

    var context = {
        user: req.session.user,
        question: question
    }
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }

    res.render('trivia_question.ejs', context);
    res.end();
}

// render the connect page
exports.connect = function(req, res){
    var context = {
        user: req.session.user
    }
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }

    res.render('connect.ejs', context);
    res.end();
}

// render the profile page
exports.profile = function(req, res){
    var context = {
        user: req.session.user
    }
    if (!req.session.user) {
        res.redirect('/login');
        return;
    }

    res.render('profile.ejs', context);
    res.end();
}

// render the register page
exports.register = function(req, res){
    var context = {
        user: req.session.user,
        message: req.session.registerMessage
    }

    res.render('register.ejs', context);
    res.end();
}

// render the login page
exports.login = function(req, res){
    var context = {
        user: req.session.user,
        message: req.session.loginMessage
    }

    res.render('login.ejs', context);
    res.end();
}
