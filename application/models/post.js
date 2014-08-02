var db = require('../models').db;

module.exports = function(sequelize, DataTypes) {
    var Post = sequelize.define('Post',
    {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	author: DataTypes.STRING,
	title: DataTypes.STRING,
	text: DataTypes.STRING(1024)
    }, 
    {
        timestamps: true,
        underscored: true,
    });

    return Post;
}
