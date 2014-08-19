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
                timestamps:       false,
                underscored:      true,
                instanceMethods:  {
                    generateEmailToken: function(){
                        this.dataValues.email_token = require('crypto').randomBytes(48).toString('base64');
                        console.log(this.email_token);
                        this.save();
                    }
                }
            }
          );

    return User;
}
