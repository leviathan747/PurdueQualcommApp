var db = require('../models').db;

// get all posts
exports.getPosts = function(callback) {
  db.Post.findAll({include: [{model: db.User, as: "Author"}], order: "`created_at` DESC"})
  .success(function(posts) {
    callback(posts, null);
  })
  .error(function(err) {
    callback(null, err);
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

  // validation
  title = title.trim();
  text = text.trim();

  if (title.length > 255) {
    req.session.errorMessage = "The title is too long";
    res.redirect("/events");
    return;
  }
  if (text.length > 1024) {
    req.session.errorMessage = "The post is too long";
    res.redirect("/events");
    return;
  }

  // create post
  db.Post.create({
    title: title,
    text: text
  })
  .success(function(post) {
    post.setAuthor(req.session.user)
   .success(function() {
      res.redirect("/events");
    })
    .error(function(err) {
      console.log(JSON.stringify(err));
      res.redirect("/events");
    });
  })
  .error(function(err) {
    console.log(JSON.stringify(err));
    res.redirect("/events");
  });

}

// update a post
exports.updatePost = function(req, res) {
  if (!req.session.user || req.session.user.type != "admin") {
    res.redirect("/");
    return;
  }

  var id = req.body.id;
  var title = req.body.title;
  var text = req.body.text;

  if (!id || !title || !text) {
    res.redirect("/events");
    return;
  }

  // validation
  title = title.trim();
  text = text.trim();

  if (title.length > 255) {
    req.session.errorMessage = "The title is too long";
    res.redirect("/events");
    return;
  }
  if (text.length > 1024) {
    req.session.errorMessage = "The post is too long";
    res.redirect("/events");
    return;
  }

  db.Post.find({where: {id: id}})
  .success(function(post) {
    post.updateAttributes({
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
  })
  .error(function(err) {
    console.log(JSON.stringify(err));
    res.redirect("/events");
  });

}
// delete posts
exports.deletePosts = function(req, res) {

  if (!req.session.user || req.session.user.type != "admin") {
    res.redirect("/");
    return;
  }

  var ids = req.query.ids;
  db.Post.findAll({where: {id: {in: ids}}})
  .success(function(posts) {
    var destroyed = 0;
    for (var i = 0; i < posts.length; i++) {
      posts[i].destroy()
      .success(function() {
        if (++destroyed == posts.length) {
          res.redirect("/events");
        }
      })
      .error(function() {
        console.log(JSON.stringify(err));
        res.redirect("/events");
      });
    }
  })
  .error(function(err) {
    console.log(JSON.stringify(err));
    res.redirect("/events");
  });
}
