var db = require('../models').db;

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User',
    {
    	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    	email: DataTypes.STRING,
    	name: DataTypes.STRING,
    	password: DataTypes.STRING,
    	type: DataTypes.STRING,
    }, 
    {   
        // used as a setter as opposed to getter to use the parameter as a callback.
        setterMethods: {
            points : function (callback) {
                var points = 0;

                // find all answers for the current user
                db.Answer.findAll({where :{ user_id : this.id } }).success(function(answers) {
                    // check each answer's correctness
                    var numAnswers = answers.length;
                    for(var index = 0; index < answers.length; index++){
                        // find all question's that were answered
                        (function(i) {
                            
                            db.Question.find({where: {id: answers[i].question_id}})
                                .success(function(question) {
                                    // if answer is correct add to total score
                                    if (question.answer == answers[i].answer) {
                                        points += question.points; 
                                    }

                                    // execute callback when all points are calculated
                                    if(--numAnswers < 1) {
                                        callback(points);
                                    }
                                })
                                .error(function(err) {
                                    console.log("Error calculating points for user " + this.name);
                                });
                                
                        })(index);
                    }
                });
            }
        },
        timestamps: false,
        underscored: true,
    });

    User.hasMany(db.Answer);
    return User;
}
