var db = require('../models').db;

// render the index page
exports.index = function(req, res){
    db.User.findOrCreate({name: "Levi"})
    .success(function() {
        res.render('index.ejs');
    })
    .error(function(err) {
        res.write(JSON.stringify(err));
        res.end();
    });
}
