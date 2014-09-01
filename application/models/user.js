var sendgrid  = require('sendgrid')('kirbyk', 'DYP*mYL&i1');

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
                points:
                  { type:          DataTypes.INTEGER,
                    defaultValue:  0 },
                email_verified:  DataTypes.BOOLEAN,
                email_token:     DataTypes.STRING
            },
            {
                timestamps:       false,
                underscored:      true,
                instanceMethods:  {
                    sendRegistrationEmail: function(req, res){
                        var token     = this.dataValues.email_token;
                        var url       = 'http://' + req.headers.host + '/';
                        var path      = url + 'validateEmail?token=' + token;
                        var fromEmail = 'jlewis@qualcomm.com';

                        var email     = new sendgrid.Email();
                        email.to      = this.dataValues.email;
                        email.from    = fromEmail;
                        email.subject = 'Welcome to Q@Purdue';
                        email.setHtml('Thanks for registering!<br>Keep accumulating points and trying to win.  In the meantime, we need you to confirm your email.<br> Please click <a href="' + path + '">Here</a> to confirm your email  ');

                        sendgrid.send(email, function(err, json) {
                          if (err) { console.error(err); }
                          // Don't need to do anything with the response,
                          // but its in `json` if we need it in the future
                          //console.log(json);
                        });
                    },
                    generateEmailToken: function(){
                        this.dataValues.email_token = require('crypto').randomBytes(48).toString('hex');
                        this.save();
                    }
                }
            }
          );

    return User;
}
