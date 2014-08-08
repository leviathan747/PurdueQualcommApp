var fs        = require('fs')
  , path      = require('path')
  , Sequelize = require('sequelize')
  , lodash    = require('lodash')
  , mysequelize = null
  , db        = {};
 
var sequelize = function(config, callback) {
    if (mysequelize == null)
        mysequelize = new Sequelize(config.database, config.username, config.password, { dialect: config.dialect, port: config.port, host: config.host });
    
    fs
      .readdirSync(__dirname)
      .filter(function(file) {
        return (file.indexOf('.') !== 0) && (file !== 'index.js')
      })
      .forEach(function(file) {
        var model = mysequelize.import(path.join(__dirname, file))
        db[model.name] = model
      })

    Object.keys(db).forEach(function(modelName) {
      if ('associate' in db[modelName]) {
        db[modelName].associate(db)
      }
    })

    Object.keys(db).forEach(function(modelName) {
      if ('setBelongs' in db[modelName]) {
        db[modelName].setBelongs(db)
      }
    })
    
    mysequelize.sync().complete(callback);
    //mysequelize.sync({force: true}).complete(callback);
}
 
module.exports = lodash.extend({
  sequelize: sequelize,
  Sequelize: Sequelize,
  db: db
})
