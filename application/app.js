var express = require('express');
var partials = require('express-partials');
var path = require('path');
var fs = require('fs');
var db = require('./models');
var Encoder = require('node-html-encoder').Encoder;
var bodyParser = require('body-parser');
var session = require('express-session');
var http = require('http');
var logger = require('morgan');

var pages      = require('./routes/index');
var controller = require('./routes/controller');
var register = require('./routes/register');
var posts = require('./routes/posts');

var config = null;
var app = express();

// check if logged in
function isLoggedIn(req, res, next) {
    if (!req.session.user) {
        req.session.originalTarget = req.url;
        res.redirect('/login');
    }
    else next();
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));

fs.readFile("config.json", 'utf8', function(err, data) {
    if (err) {
        if (err.code == 'ENOENT')
            console.log("Could not find any config file.");
        process.exit(-1);
    }
    
    try {
        config = JSON.parse(data);
    }
    catch(e) {
        console.log("readFile Parse Error: ", e);
        process.exit(-1);
    }
    
    // get config (defaults to development)
    var configName = process.argv[2] || 'development';

    // get port number
    var defaultPort = 4000;
    var defaultPort = process.argv[3] || defaultPort;
    
    console.log(configName);
    console.log("Server port: " + defaultPort);
    
    db.sequelize(config[configName], function(err) {
        if (err) {
            console.log("Sequelize err: " + err[0]);
            process.exit(-1);
        }
        else {
            // all environments
            process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
            
            // Set up globals in the req object.
            // Do this first or they will not show up in the req.
            app.use(function(req, res, next) {
                req.db = db.db;
                req.configName = configName;
                req.encoder = new Encoder('entity');
                next();
            });
            
            app.use(partials());
            app.use(session({
                secret: 'boilerup',
                cookie: {secure: false},
                resave: true,
                saveUninitialized: true
            }));

            app.set('port', process.env.PORT || defaultPort);
            app.set('views', path.join(__dirname, 'views'));
            app.set('view engine', 'ejs');
            app.use(logger('dev'));
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({extended: 'false'}));
            app.use(express.static('public'));
            app.use(express.static(path.join(__dirname, 'public')));

            // get requests
            app.get('/', pages.index);
            app.get('/events', pages.events);
            app.get('/tech', pages.tech);
            app.get('/trivia', isLoggedIn, pages.trivia);
            app.get('/trivia/leaderboard', isLoggedIn, pages.leaderboard);
            app.get('/trivia/:id', isLoggedIn, pages.triviaQuestion);
            app.get('/connect', isLoggedIn, pages.connect);
            app.get('/profile', isLoggedIn, pages.profile);
            app.get('/register', pages.register);
            app.get('/login', pages.login);
            app.get('/logout', register.logout);

            app.get('/getPosts', posts.getPosts);
            app.get('/deletePosts', posts.deletePosts);


            // post requests
            app.post('/login', register.login);
            app.post('/register', register.register);
            app.post('/stopServer', controller.stopServer);

            app.post('/createPost', posts.createPost);
            app.post('/updatePost', posts.updatePost);
            app.post('/answerQuestion', isLoggedIn, controller.answerQuestion);

            http.createServer(app).listen(app.get('port'), function(){
                console.log('Express server listening on port ' + app.get('port'))
            });
        }
    });
});
