module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User',
    {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	name: DataTypes.STRING,
    }, 
    {
        timestamps: false,
        underscored: true,
    });
  
    return User;
}
