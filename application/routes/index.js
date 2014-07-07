var db = require('../models').db;

// render the index page
exports.index = function(req, res){
    var name = req.query.name;
    if (!name) {
        res.render('index.ejs');
        return;
    }
    name = name.trim();
    db.User.findOrCreate({name: name})
    .success(function() {
        res.render('index.ejs');
    })
    .error(function(err) {
        res.write(JSON.stringify(err));
        res.end();
    });
}
