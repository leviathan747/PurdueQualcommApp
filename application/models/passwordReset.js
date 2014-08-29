module.exports = function(sequelize, DataTypes) {
    var PasswordReset = sequelize.define('PasswordReset',
            {
                id:
                  { type:           DataTypes.INTEGER,
                    primaryKey:     true,
                    autoIncrement:  true},
                token:     DataTypes.STRING
            },
            {
                timestamps:       false,
                underscored:      true,
                instanceMethods:  {
                    sendEmail: function(){
                        var token     = this.dataValues.token;
                        var url       = 'http://' + req.headers.host + '/';
                        var path      = url + 'passwordReset?token=' + token;
                        var fromEmail = 'jlewis@qualcomm.com';

                        var email     = new sendgrid.Email();
                        email.to      = this.dataValues.email;
                        email.from    = fromEmail;
                        email.subject = '[Q@Purdue] Password Reset inside';
                        email.setHtml('Somebody has requested a new password for your account on Q@Purdue<br>If this was you, then follow the link below to reset your password.<br>If this wasn\'t you, then please just ignore this email. <br> Click <a href="' + path + '">Here</a> to reset your password');

                        sendgrid.send(email, function(err, json) {
                          if (err) { console.error(err); }
                          // Don't need to do anything with the response,
                          // but its in `json` if we need it in the future
                          //console.log(json);
                        });
                    },
                }
            }
          );

    return PasswordReset;
}
