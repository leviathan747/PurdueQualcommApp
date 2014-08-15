var db = require('../models').db;

module.exports = function(sequelize, DataTypes) {
    var Answer = sequelize.define('Answer', {
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	    answer: DataTypes.STRING
    }, 
    {
    	hooks: {
    		afterCreate: function (answer, callback) {
                console.log("hi");
    		},
    		afterDestroy: function(answer, callback) {
    		    console.log("bye");	
    		}
    	}
    },
    {
        timestamps: false,
        underscored: true,
    });

    return Answer;
}
