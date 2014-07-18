module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User',
    {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	email: DataTypes.STRING,
	password: DataTypes.STRING,
	type: DataTypes.STRING
    }, 
    {
        timestamps: false,
        underscored: true,
    });
  
    return User;
}
