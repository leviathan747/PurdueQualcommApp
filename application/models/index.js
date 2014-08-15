var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var mysequelize = null;
var db = {};
 
var sequelize = function(config, callback) {
    if (mysequelize == null)
        mysequelize = new Sequelize(config.database, config.username, config.password, { dialect: config.dialect, port: config.port, host: config.host });
    
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

    // Hooks

    db.Answer.afterCreate(function(answer, callback){
        // find User
        db.User.find({where: {id: answer.user_id}})
            .success(function(User){
                // find question then check answer
                db.Question.find({where: {id: answer.question_id}})
                    .success(function(question) {
                        // if answer is correct add to total score
                        if (question.answer == answer.answer) {
                            User.increment({'points': question.points})
                                .success(function(user){
                                    console.log('successful increment');
                                });
                        }
                    })
                    .error(function(err) {
                        console.log("Error calculating points for user ");
                    });
            })
            .error(function(err){
                /* TODO Not sure what to do with callback */
                console.log('Failed to find User; please call appropriate callback');
            });
    });

    db.Answer.afterDestroy(function(answer, callback){
        // find User
                db.User.find({where: {id: answer.user_id}})
                    .success(function(User){

                        // find question then check answer
                        db.Question.find({where: {id: answer.question_id}})
                            .success(function(question) {
                                // if answer is correct add to total score
                                if (question.answer == answer.answer) {
                                    User.decrement({'points': question.points*2})
                                        .success(function(user){
                                            console.log('successful decrement');
                                        });
                                }
                            })
                            .error(function(err) {
                                console.log("Error calculating points for user ");
                            });
                    })
                    .error(function(err){
                        /* TODO Not sure what to do with callback */
                        console.log('Failed to find User; please call appropriate callback');
                    });
    });


    mysequelize.sync().complete(callback);
    //mysequelize.sync({force: true}).complete(callback);
}
 
module.exports = {
  sequelize: sequelize,
  db: db
}
