var db = require('../models').db;

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User',
    {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	email: DataTypes.STRING,
	name: DataTypes.STRING,
	password: DataTypes.STRING,
	type: DataTypes.STRING
    }, 
    {
        timestamps: false,
        underscored: true,
    });

    User.hasMany(db.Answer);
  
    return User;
}
