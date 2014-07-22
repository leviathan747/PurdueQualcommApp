var db = require('../models').db;

// register in and update the user session variable
// note: we are not using redirects, but writing the url back
// to the client. that way it can request the page without
// re-rendering the layout
exports.register = function(req, res) {
    var email = req.body.email.trim();
    var password = req.body.password.trim();
    var type = 'student';                       // hard coded as 'student' for now

    // TODO validation
    // TODO save hash of password

    // create user
    // TODO do a database find, then create so you can check to make sure you're not overwriting
    db.User.findOrCreate({email: email, password: password, type: type})
    .success(function(user) {
        req.session.user = user.dataValues;     // set session user
        res.redirect('/profile');                  // redirect to profile page
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
        // check password
        else if (password != user.dataValues.password) {
            req.session.loginMessage = 'Oops! Wrong password';
            res.redirect('/login');
            res.end();
        }
        else {
            req.session.user = user.dataValues; // set session user
            res.redirect('/profile');              // redirect to profile page
            res.end();
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
