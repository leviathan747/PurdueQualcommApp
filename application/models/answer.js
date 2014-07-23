module.exports = function(sequelize, DataTypes) {
    var Answer = sequelize.define('Answer',
    {
	id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	email: DataTypes.STRING,
	question_id: DataTypes.INTEGER,
    answer: DataTypes.STRING
    }, 
    {
        timestamps: false,
        underscored: true,
    });
  
    return Answer;
}
