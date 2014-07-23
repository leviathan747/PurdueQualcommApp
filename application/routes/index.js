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
    db.Question.findAll()
    .success(function(questions) {
        var context = {
            user: req.session.user,
            questions: questions
        }
        res.render('trivia.ejs', context);
        res.end();
    })
    .error(function(err) {
        console.log(err);
        res.redirect("/trivia");
    });
}

// render the connect page
exports.connect = function(req, res){
    var context = {
        user: req.session.user
    }

    res.render('connect.ejs', context);
    res.end();
}

// render the profile page
exports.profile = function(req, res){
    var context = {
        user: req.session.user
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
