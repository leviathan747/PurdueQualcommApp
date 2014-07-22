module.exports = function(sequelize, DataTypes) {
    var Question = sequelize.define('Question',
    {
	question_id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	question: DataTypes.STRING,
	a: DataTypes.STRING,
    b: DataTypes.STRING,
    c: DataTypes.STRING,
    d: DataTypes.STRING,
	explanation: DataTypes.STRING
    }, 
    {
        timestamps: false,
        underscored: true,
    });
  
    return Question;
}
