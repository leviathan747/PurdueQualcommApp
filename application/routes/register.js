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
                        req.session.user = user.dataValues;                                         // set session user
                        if (req.session.originalTarget) res.redirect(req.session.originalTarget);   // redirect to where they wanted to go
                        else res.redirect('/profile');                                              // redirect to profile page
                        req.session.originalTarget = null;
                        res.end();
                    }).error(function(err){
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

// log in and update the user session variable
exports.login = function(req, res) {
    var email = req.body.email && req.body.email.trim();
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
                    req.session.user = user.dataValues;                                         // set session user
                    if (req.session.originalTarget) res.redirect(req.session.originalTarget);   // redirect to where they wanted to go
                    else res.redirect('/profile');                                              // redirect to profile page
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
