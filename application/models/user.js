module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define('User',
            {
                id:
                  { type:           DataTypes.INTEGER,
                    primaryKey:     true,
                    autoIncrement:  true},
                email:           DataTypes.STRING,
                name:            DataTypes.STRING,
                password:        DataTypes.STRING,
                type:            DataTypes.STRING,
                email_verified:  DataTypes.BOOLEAN,
                email_token:     DataTypes.STRING
            },
            {
                timestamps:   false,
                underscored:  true,
            }
          );

    return User;
}
