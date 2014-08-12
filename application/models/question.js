var db = require('../models').db;

module.exports = function(sequelize, DataTypes) {
    var Question = sequelize.define('Question',
    {
    	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    	question: DataTypes.STRING,
    	a: DataTypes.STRING,
        b: DataTypes.STRING,
        c: DataTypes.STRING,
        d: DataTypes.STRING,
        answer: DataTypes.STRING,
    	explanation: DataTypes.STRING,
        points: DataTypes.INTEGER
    }, 
    {
        timestamps: false,
        underscored: true,
    });

    Question.hasMany(db.Answer);
  
    return Question;
}
