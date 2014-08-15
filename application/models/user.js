module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User',
    {
    	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    	email: DataTypes.STRING,
    	name: DataTypes.STRING,
    	password: DataTypes.STRING,
    	type: DataTypes.STRING,
        points: { type: DataTypes.INTEGER, defaultValue: 0}
    }, 
    {   
        timestamps: false,
        underscored: true,
    });

    return User;
}
