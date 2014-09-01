var db = require('../models').db;
var bcrypt = require('bcrypt');

var validInput = function(input) {
    var errorMessage = '';

    // check all elements for length; potentially more checks later.
    for(var element in input) {
        if(input.hasOwnProperty(element)) {
            // if email check the format
            if (element === 'email') {
                var email = /^[a-zA-Z0-9_]+@purdue\.edu$/;
                if(!email.test(input[element])) {
                    errorMessage += element + ': Please enter a valid Purdue email address!\n';
                }
            }

            if(!input[element] || input[element].length < 1){
                // if input[element] is not defined or email is empty string
                // it would have been checked above
                if(element !== 'email'){
                    errorMessage += element + ': Can not be empty!\n';
                }
            }
        }
    }
    return errorMessage;
}
// register in and update the user session variable
exports.register = function(req, res) {
    // check that input is defined; Possible if an empty post request is 
    // sent to server.
    var email = req.body.email && req.body.email.trim();
    var password = req.body.password && req.body.password.trim();
    var first = req.body.firstName && req.body.firstName.trim();
    var last = req.body.lastName && req.body.lastName.trim();
    var name = first + " " + last;
    var type = 'student';                       // hard coded as 'student' for now

    var errorMessage = validInput({email: email, password: password, name: name, type:type});
    if(errorMessage !== '') {
        req.session.registerMessage = errorMessage;
        res.redirect('/register');
        res.end();
        return;
    }
    // TODO validation

    // find user; If no user exists create it
    db.User.find({where: {email: email}})
    .success(function(user) {
        if (!user) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    db.User.create({email: email, name:name, password: hash, type: type})
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
    var email    = req.body.email && req.body.email.trim();
    var password = req.body.password && req.body.password.trim();

    var errorMessage = validInput({email: email, password: password});
    if(errorMessage !== '') {
        req.session.loginMessage = errorMessage;
        res.redirect('/login');
        res.end();
        return;
    }
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
    .success(function(user) {
        db.PasswordReset.findAll()
        .success(function(resets) {
            var crypto     = require('crypto');
            var token      = crypto.randomBytes(48).toString('hex');
            var unusedToken = false;
            while (!unusedToken) {
                unusedToken = true;                           // assume that the token will be unused
                for (var i = 0; i < resets.length; i++) {
                    if (resets.token == token) {
                        unusedToken = false;                  // if we see it in the resets, mark it as used
                        break;                                // break out of for loop
                    }
                }
                token = crypto.randomBytes(48).toString('hex');
            }

            db.PasswordReset.create( {userId: user.dataValues.id, token: token} )
            .success(function(password_reset) {
                user.setPasswordReset(password_reset)
                .success(function() {
                    password_reset.setUser(user)
                    .success(function(){
                        password_reset.sendEmail(req, res);
                        req.session.infoMessage = 'Password reset sent, please check your email';
                        res.redirect('/');
                        res.end();
                    })
                    .error(function(err) {
                        console.log(JSON.stringify(err));
                        res.write(JSON.stringify(err));
                        res.end();
                    });
                })
                .error(function(err) {
                    console.log(JSON.stringify(err));
                    res.write(JSON.stringify(err));
                    res.end();
                });
            })
            .error(function(err) {
                console.log(JSON.stringify(err));
                res.write(JSON.stringify(err));
                res.end();
            });
        })
        .error(function(err) {
            console.log(JSON.stringify(err));
            res.write(JSON.stringify(err));
            res.end();
        });
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
        res.write(JSON.stringify(err));
        res.end();
    });
}

// POST '/passwordReset'
exports.setNewPassword = function(req, res) {
    var token                 = req.body.token.trim();
    var password              = req.body.password.trim();
    var password_confirmation = req.body.password_confirmation.trim();


    if (password !== password_confirmation){
        req.session.message = "Passwords did not match, try again";
        res.redirect(req.header('Referer') || '/');
        res.end();
        return;
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
                          .success(function(){
                              passwordReset.dataValues.used = true;
                              passwordReset.save()
                                .error(function(err){
                                    console.log(JSON.stringify(err));
                                });
                          })
                          .error(function(err){
                              console.log(JSON.stringify(err));
                          });
                    });
                });
            });
      });
      req.session.infoMessage = 'Password Reset, try logging in again';
      res.redirect('/login');
      res.end();
}
