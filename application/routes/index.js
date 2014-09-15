var db = require('../models').db;
var triviaUtils = require('./triviaUtils');
var postUtils = require('./posts');

// render the index page
exports.index = function(req, res){
    res.redirect('/events');
}

// render the events page
exports.events = function(req, res){
    postUtils.getPosts(function(posts, err) {
      if (err) {
        res.write(JSON.stringify(err));
        res.end();
        return;
      }

      // format date for posts
      function formatAMPM(date) {
        var hours = date.getHours();
        var minutes = date.getMinutes();
        var ampm = hours >= 12 ? 'pm' : 'am';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        minutes = minutes < 10 ? '0'+minutes : minutes;
        var strTime = hours + ':' + minutes + ' ' + ampm;
        return strTime;
      }
      for (var i = 0; i < posts.length; i++) {
          var d = new Date(posts[i].created_at);
          var date = d.toDateString() + " at " + formatAMPM(d);
          posts[i].date = date;
      }

      var context = {
          triviaActive: req.triviaActive,
          user:         req.session.user,
          errorMessage:      req.session.errorMessage,
          infoMessage:  req.session.infoMessage,
          posts:        posts
      }

      req.session.errorMessage = null;
      req.session.infoMessage = null;

      res.render('events.ejs', context);
      res.end();
    });
}

// render the tech page
exports.tech = function(req, res){
    var context = {
        triviaActive: req.triviaActive,
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
                triviaActive: req.triviaActive,
                user:       req.session.user,
                questions:  formattedQuestions
            }
            res.render('trivia.ejs', context);
            res.end();
        });
    });
}

// render the trivia leaderboard page
exports.leaderboard = function(req, res){
    triviaUtils.getLeaderboard(null, function(users, err) {
        if (err) {
            console.log(JSON.stringify(err));
            res.redirect("/trivia");
            return;
        }

        // add rank to current user
        for (var i = 0; i < users.length; i++) {
            if (users[i].id == req.session.user.id) req.session.user.rank = users[i].dataValues.rank;
        }

        var context = {
            triviaActive: req.triviaActive,
            user:   req.session.user,
            users:  users
        }

        res.render('trivia_leaderboard.ejs', context);
        res.end();
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
                    triviaActive: req.triviaActive,
                    user:      req.session.user,
                    question:  formattedQuestion
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
        triviaActive: req.triviaActive,
        user: req.session.user
    }

    res.render('connect.ejs', context);
    res.end();
}

// render the careers page
exports.careers = function(req, res){
    var context = {
        triviaActive: req.triviaActive,
        user: req.session.user
    }

    res.render('careers.ejs', context);
    res.end();
}

// render the register page
exports.register = function(req, res){
    var context = {
        triviaActive: req.triviaActive,
        user:         req.session.user,
        infoMessage:  req.session.infoMessage,
        errorMessage:      req.session.errorMessage
    }

    req.session.errorMessage = null;
    req.session.infoMessage = null;

    res.render('register.ejs', context);
    res.end();
}

// render the login page
exports.login = function(req, res){
    var context = {
        triviaActive: req.triviaActive,
        user:         req.session.user,
        infoMessage:  req.session.infoMessage,
        errorMessage:      req.session.errorMessage
    }

    req.session.errorMessage = null;
    req.session.infoMessage = null;

    res.render('login.ejs', context);
    res.end();
}

// render the verfify email page
exports.verifyEmail = function(req, res){
    var context = {
        triviaActive: req.triviaActive,
        user: req.session.user
    }

    res.render('verifyemail.ejs', context);
    res.end();
}

// render the forgotPassword page
// GET '/forgotPassword'
exports.forgotPassword = function(req, res){
    var context = {
        triviaActive: req.triviaActive,
        user:         req.session.user,
        infoMessage:  req.session.infoMessage,
        errorMessage:      req.session.errorMessage
    }

    req.session.errorMessage = null;
    req.session.infoMessage = null;

    res.render('forgotpassword.ejs', context);
    res.end();
}

// render the resetPassword page
exports.resetPassword = function(req, res){
    var token = req.query.token.trim();

    db.PasswordReset.find( {where: { token: token} })
      .success( function(passwordReset){
          var two_hours = 1000 * 60 * 60 * 2; // 1000 ms * 60 secs * 60 mins * 2hrs
          var created   = Date.parse(passwordReset.dataValues.created_at);

          if(created < Date.now() - two_hours){
              console.log("too old");
              req.session.errorMessage = "Password reset is no longer valid";
              res.redirect('/forgotPassword');
              res.end();
              return;
          }

          if(passwordReset.dataValues.used){
              console.log("already been used");
              req.session.errorMessage = "Password reset has already been used";
              res.redirect('/forgotPassword');
              res.send();
              return;
          }
          var context = {
              triviaActive: req.triviaActive,
              user:          req.session.user,
              infoMessage:   req.session.infoMessage,
              errorMessage:       req.session.errorMessage,
              token:         token
          }


          req.session.errorMessage = null;
          req.session.infoMessage = null;

          res.render('resetpassword.ejs', context);
          res.end();
      });
}

// render the video wall page
exports.videoWall = function(req, res) {
    res.render('videowall.ejs', {layout: false});
    res.end();
}
