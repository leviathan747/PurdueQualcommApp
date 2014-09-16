var sendgrid  = require('sendgrid')('qatpurdue', 'qua1commBoilers');

module.exports = function(sequelize, DataTypes) {
    var PasswordReset = sequelize.define('PasswordReset',
            {
                id:
                  { type:           DataTypes.INTEGER,
                    primaryKey:     true,
                    autoIncrement:  true},
                used:
                  {
                      type:         DataTypes.BOOLEAN,
                      defaultValue: false},
                token:  DataTypes.STRING
            },
            {
                timestamps:       true,
                underscored:      true,
                instanceMethods:  {
                    sendEmail: function(req, res){
                        var token     = this.dataValues.token;
                        var url       = 'http://' + req.headers.host + '/';
                        var path      = url + 'passwordReset?token=' + token;
                        var fromEmail = 'jalewis@qualcomm.com';

                        var email     = new sendgrid.Email();
                        email.to      = this.getUser()
                          .success(function(user){
                              email.to      = user.dataValues.email;
                              email.from    = fromEmail;
                              email.subject = '[Q@Purdue] Password Reset inside';
                              email.setHtml('<h3>Somebody has requested a new password for your account on Q@Purdue</h3><br><br>If this was you, then follow the link below to reset your password.<br>If this wasn\'t you, then please just ignore this email.<br> <br> Click <a href="' + path + '">Here</a> to reset your password');

                              sendgrid.send(email, function(err, json) {
                                if (err) { console.error(err); }
                                // Don't need to do anything with the response,
                                // but its in `json` if we need it in the future
                                //console.log(json);
                              });
                          });
                    },
                }
            }
          );

    return PasswordReset;
}
