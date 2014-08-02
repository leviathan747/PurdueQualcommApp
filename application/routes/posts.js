var db = require('../models').db;

// get all posts
exports.getPosts = function(req, res) {
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

// create a post
exports.createPost = function(req, res) {
  if (!req.session.user || req.session.user.type != "admin") {
    res.redirect("/");
    return;
  }

  var author = req.session.user.email;
  var title = req.body.title;
  var text = req.body.text;

  if (!author || !title || !text) {
    res.redirect("/events");
    return;
  }

  title = title.trim();
  text = text.trim();

  db.Post.create({
    author: author,
    title: title,
    text: text
  })
  .success(function() {
    res.redirect("/events");
  })
  .error(function(err) {
    console.log(JSON.stringify(err));
    res.redirect("/events");
  });

}
