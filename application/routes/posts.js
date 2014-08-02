var db = require('../models').db;

// get all posts
exports.getPosts = function(req, res){
  db.Post.findAll()
  .success(function(posts) {
    res.write(JSON.stringify(posts));
    res.end();
  })
  .error(function(err) {
    res.write(JSON.stringify(err));
    res.end();
  });
}
