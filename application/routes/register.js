var db = require('../models').db;
var bcrypt = require('bcrypt');

// register in and update the user session variable
exports.register = function(req, res) {
    var email = req.body.email.trim();
    var password = req.body.password.trim();
    // hard coded as 'student' for now
    var type = 'student';

    // find user; If no user exists create it
    db.User.find({where: {email: email}})
    .success(function(user) {
        if (!user) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    db.User.create({email: email, password: hash, type: type})
                    .success(function(user) {
                        req.session.user = user.dataValues;          // set session user
                        if (req.session.originalTarget){
                          res.redirect(req.session.originalTarget);  // redirect to where they wanted to go
                        } else {
                          res.redirect('/profile');                  // redirect to profile page
                        }
                        req.session.originalTarget = null;
                        res.end();
                    })
                    .error(function(err){
                        console.log(JSON.stringify(err));
                    });
                });
            });
            user.generateEmailToken();
        } else {
          req.session.message = 'Oops! User already exists!';
          res.redirect('/register');
          res.end();
        }
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
    });
}

exports.validate_email = function(req, res){
    var unique_token = req.body.token.trim();
    var user         = req.session.user;
    console.log(unique_token);
    if (unique_token === user.email_token){
        user.email_verified = true;
    }
}

// log in and update the user session variable
exports.login = function(req, res) {
    var email    = req.body.email.trim();
    var password = req.body.password.trim();

    // find user
    db.User.find({where: {email: email}})
    .success(function(user) {
        if (!user) {
            req.session.message = 'User does not exist';
            res.redirect('/login');
            res.end();
        }
        else {
            // check password
            bcrypt.compare(password, user.dataValues.password, function(err, resp) {
                if(resp != true) {
                    req.session.message = 'Oops! Wrong password';
                    res.redirect('/login');
                    res.end();
                }
                else {
                    req.session.user = user.dataValues;          // set session user
                    if (req.session.originalTarget){
                      res.redirect(req.session.originalTarget);  // redirect to where they wanted to go
                    } else {
                      res.redirect('/profile');                  // redirect to profile page
                    }
                    req.session.originalTarget = null;
                    res.end();
                }
            });
        }
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
    });
}

// log out
exports.logout = function(req, res) {
    req.session.user = null;
    res.redirect('/');
}
