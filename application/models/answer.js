var db = require('../models').db;

module.exports = function(sequelize, DataTypes) {
    var Answer = sequelize.define('Answer', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	    answer: DataTypes.STRING
    }, 
    {
        timestamps: false,
        underscored: true,
    });

    return Answer;
}
