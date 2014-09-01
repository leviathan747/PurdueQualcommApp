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
                        // Note, order on these next two is very important
                        user.generateEmailToken();
                        user.sendRegistrationEmail(req, res);
                        req.session.originalTarget = null;
                        res.end();
                    })
                    .error(function(err){
                        console.log(JSON.stringify(err));
                    });
                });
            });
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
    var unique_token = req.query.token.trim();
    db.User.find({where: {id: req.session.user.id}})
      .success( function(user){
          if (unique_token === user.email_token){
              req.session.message = 'Successfully validated email';
              user.dataValues.email_verified = true;
              user.save();
          } else {
              req.session.message = 'Failed to validate email';
          }
          res.redirect('/');
          res.end();
      });
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

// POST '/forgotPassword'
exports.genPasswordReset = function(req, res) {
    var email_requested = req.body.email.trim();

    db.User.find({where: {email: email_requested}})
      .success(function(user){
          var crypto     = require('crypto');
          var token      = crypto.randomBytes(48).toString('hex');
          var unusedToken = false;
          while(!unusedToken){
              db.PasswordReset.find( {where: { token: token} })
                .success( function(reset){
                    // we found a password reset with this token, so try again
                    token = crypto.randomBytes(48).toString('hex');
                    unusedToken = false;
                })
                .error( function(){
                    // an error in this case actually means that this
                    // token doesn't exist in the DB, so this is the one we use
                    unusedToken = true;
                });
                // don't know how to get this loop properly working with
                // the callback hell going on here
                // TODO figure out a good way to remove the below line
                unusedToken = true;
          }

          db.PasswordReset.create( {userId: user.dataValues.id, token: token} )
          // couldn't figure out how to get a Promise object, so I chained them
          // its gross and there's a better way to do this
            .success(function(password_reset){
                user.setPasswordReset(password_reset)
                  .success(function(){
                      password_reset.setUser(user)
                        .success(function(){
                            password_reset.sendEmail(req, res);
                        });
                  });
            });
          req.session.message = 'Password reset sent, please check your email';
          res.redirect('/');
          res.end();
      })
}

// POST '/passwordReset'
exports.setNewPassword = function(req, res) {
    console.log(req.body);
    var token                 = req.body.token.trim();
    var password              = req.body.password.trim();
    var password_confirmation = req.body.password_confirmation.trim();

    if (password !== password_confirmation){
      req.session.message = "Passwords did not match, try again";
      res.redirect(req.header('Referer') || '/');
      res.end();
    }

    db.PasswordReset.find( {where: { token: token} })
      .success( function(passwordReset){
          passwordReset.getUser()
            .success(function(user){
                bcrypt.genSalt(10, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        // Store hash in your password DB.
                        user.dataValues.password = hash;
                        user.save()
                          .error(function(err){
                              console.log(JSON.stringify(err));
                          });
                    });
                });
            });
      });
      req.session.message = 'Password Reset, try logging in again';
      res.redirect('/login');
      res.end();
}
