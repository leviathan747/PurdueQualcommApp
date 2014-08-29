var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var mysequelize = null;
var db = {};

var sequelize = function(config, callback) {
    if (mysequelize == null){
        mysequelize = new Sequelize(config.database,
                                    config.username,
                                    config.password,
                                    {
                                      dialect: config.dialect,
                                      port: config.port,
                                      host: config.host
                                    });
    }

    fs.readdirSync(__dirname).filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
    }).forEach(function(file) {
        var model = mysequelize.import(path.join(__dirname, file))
        db[model.name] = model
    });

    // associations
    db.Question.hasMany(db.Answer);
    db.User.hasMany(db.Answer);

    db.Post.belongsTo(db.User, {as: "Author"});

    mysequelize.sync().complete(callback);
    //mysequelize.sync({force: true}).complete(callback);
}

module.exports = {
    sequelize: sequelize,
    db: db
}
