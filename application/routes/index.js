var db = require('../models').db;
var triviaUtils = require('./triviaUtils');

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
    triviaUtils.getAllQuestions(function(questions, err) {
        if (err) {
            console.log(err);
            res.redirect("/");
            return;
        }
        triviaUtils.formatQuestions(req.session.user.id, questions, function(formattedQuestions, err) {
            if (err) {
                console.log(JSON.stringify(err));
                res.redirect("/");
                return;
            }

            var context = {
                user: req.session.user,
                questions: formattedQuestions
            }
            res.render('trivia.ejs', context);
            res.end();
        });
    });
}

// render a trivia question page
exports.triviaQuestion = function(req, res){
    // "/trivia/<id>

    var id = Number(req.params.id);
    if (!id) {
        res.redirect("/trivia");
        return;
    }

    // find question
    triviaUtils.getQuestion(id, function(q, err) {
        if (err) {
            console.log(JSON.stringify(err));
            res.redirect("/trivia");
            return;
        }
        if (!q) {                       // question does not exist
            res.redirect("/trivia");
            return;
        }
        else {
            triviaUtils.formatQuestion(req.session.user.id, q, function(formattedQuestion, err) {
                if (err) {
                    console.log(JSON.stringify(err));
                    res.redirect("/trivia");
                    return;
                }
                var context = {
                    user: req.session.user,
                    question: formattedQuestion
                }
                res.render('trivia_question.ejs', context);
                res.end();
            });
        }
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
