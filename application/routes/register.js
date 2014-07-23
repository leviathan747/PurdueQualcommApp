var db = require('../models').db;
var bcrypt = require('bcrypt');
// register in and update the user session variable
// note: we are not using redirects, but writing the url back
// to the client. that way it can request the page without
// re-rendering the layout
exports.register = function(req, res) {
    var email = req.body.email.trim();
    var password = req.body.password.trim();
    var type = 'student';                       // hard coded as 'student' for now
    
    // TODO validation

    // find user; If no user exists create it
    db.User.find({where: {email: email}})
    .success(function(user) {
        if (!user) {
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(password, salt, function(err, hash) {
                    // Store hash in your password DB.
                    db.User.create({email: email, password: hash, type: type})
                    .success(function(user) {
                        req.session.user = user.dataValues; // set session user
                        res.redirect('/profile');           // redirect to profile page
                        res.end();
                    }).error(function(err){
                        console.log(JSON.stringify(err));
                    });
                });
            });
            
        } else {
           req.session.registerMessage = 'Oops! User already exists!';
           res.redirect('/register');
           res.end();
        }
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
    });
}

// log in and update the user session variable
// note: we are not using redirects, but writing the url back
// to the client. that way it can request the page without
// re-rendering the layout
exports.login = function(req, res) {
    var email = req.body.email.trim();
    var password = req.body.password.trim();

    // find user
    db.User.find({where: {email: email}})
    .success(function(user) {
        if (!user) {
            req.session.loginMessage = 'User does not exist';
            res.redirect('/login');
            res.end();
        }
        else {
            // check password
            bcrypt.compare(password, user.dataValues.password, function(err, resp) {
                if(resp != true) {
                    req.session.loginMessage = 'Oops! Wrong password';
                    res.redirect('/login');
                    res.end();
                } 
                else {
                    req.session.user = user.dataValues; // set session user
                    res.redirect('/profile');           // redirect to profile page
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
