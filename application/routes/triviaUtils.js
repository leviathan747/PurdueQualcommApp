var db = require('../models').db;

// create question
var createQuestion = function(req, res) {
    var question = req.body.question.trim();
    var a = req.body.a.trim();
    var b = req.body.b.trim();
    var c = req.body.c.trim();
    var d = req.body.d.trim();
    var explanation = req.body.explanation.trim();
    
    // find question; If no question of this kind exists create it
    db.Question.find({where: {question: question}})
    .success(function(newQuestion) {
        if (!newQuestion) {

            // create Question in DB
            db.Question.create({ question:question, a:a, b:b, c:c, d:d, explanation:explanation })
            .success(function(question) {
                console.log(question);
            }).error(function(err){
                console.log(JSON.stringify(err));
            });
   
        } 

        else {
           req.session.questionMessage = 'Oops! Question already exists!';
           res.write('/createQuestion');
           res.end();
        }
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
    });
}

//get question
var getQuestion = function(id, callback) {

    // find question
    db.Question.find({where: {id: id}})
    .success(function(question) {
        callback(question, null);
    })
    .error(function(err) {
        callback(null, err);
    });
}

// get all questions
var getAllQuestions = function(callback) {
    db.Question.findAll()
    .success(function(questions) {
        callback(questions, null);
    })
    .error(function(err) {
        callback(null, err);
    });
}

// delete question
// TODO
var deleteQuestion = function(id, callback) {
}


// create answer
var createAnswer = function(user_id, question_id, answer, callback) {
    // find answer; If no answer of this kind exists create it
    db.Answer.find({where: {user_id: user_id, question_id: question_id}})
    .success(function(newAnswer) {
        if (!newAnswer) {
            // create answer in DB
            db.Answer.create({answer: answer, user_id: user_id, question_id: question_id})
            .success(function(answer) {
                callback(null);
            }).error(function(err){
                callback(err);
            });
        } 
        else {
           callback({message: 'Oops! answer already exists!'});
        }
    })
    .error(function(err) {
        callback(err);
    });
}

// check score after created answer
var addPoints = function(answer, callback) {
    // find User
    answer.getUser()
    .success(function(user){
        // find question then check answer
        checkAnswer(answer, function(points, err) {
            if (err) {
                console.log(JSON.stringify(err));
                callback();
            }
            else {
                user.increment({'points': points})
                .success(function(user){
                    console.log('successful increment for ' + user.name);
                    callback();
                })
                .error(function(err) {
                    console.log(JSON.stringify(err));
                    callback();
                });
            }
        });
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
        callback();
    });
}

// check score after deleted answer
var removePoints = function(answer, callback) {
    // find User
    answer.getUser()
    .success(function(user){
        // find question then check answer
        checkAnswer(answer, function(points, err) {
            if (err) {
                console.log(JSON.stringify(err));
                callback();
            }
            else {
                user.decrement({'points': points})
                .success(function(user){
                    console.log('successful decrement for ' + user.name);
                    callback();
                })
                .error(function(err) {
                    console.log(JSON.stringify(err));
                    callback();
                });
            }
        });
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
        callback();
    });
}

// get answer return null if it doesn't exist
var getAnswer = function(user, question, callback) {
    db.Answer.find({where: {user_id: user, question_id: question}})
    .success(function(answer) {
        callback(answer, null);
    })
    .error(function(err) {
        callback(null, err);
    });
}

// delete answer
// TODO
var deleteAnswer = function(req, res) {
}

// check an answer for correctness. returns number of points if correct, 0 otherwise
var checkAnswer = function(answer, callback) {
    answer.getQuestion()
    .success(function(question) {
        if (question.answer === answer.answer) callback(question.points, null);
        else callback(0, null);
    })
    .error(function(err) {
        callback(0, err);
    });
}

// add answered and correct fields to a question and return it
var formatQuestion = function(user, question, callback) {
    getAnswer(user, question.id, function(answer, err) {
        if (err) {
            callback(null, err);
            return;
        }
        if (answer) {
            question.answered = true;
            checkAnswer(answer, function(correct, err) {
                if (err) {
                    callback(null, err);
                    return;
                }
                question.correct = correct;
                callback(question, null);
            });
        }
        else {
            question.answered = false;
            callback(question, null);
        }
    });
}

// format each question in the array and return it
var formatQuestions = function(user, questions, callback) {
    var i = 0;

    var recursiveCallback = function(question, err) {
        if (err) {                              // check for error
            callback(null, err);
            return;
        }

        questions[i] = question;                // update the question

        if (++i < questions.length) {           // keep going
            formatQuestion(user, questions[i], recursiveCallback);
        }

        else callback(questions, null);
    }

    if (i < questions.length) formatQuestion(user, questions[i], recursiveCallback);
    else callback(questions, null);
}

var getPoints = function(user, callback) {
    db.User.find({where: {id: user}})
    .success(function(user) {
        callback(user.points, null);
    })
    .error(function(err) {
        callback(null, err);
    });
}

// get leaderboard returns all users who are students ranked in order of points
var getLeaderboard = function(limit, callback) {
    if (!limit) limit = 1000;
    db.User.findAll({where: {type: "student"}, order: "`points` DESC", limit: limit})
    .success(function(users) {
        var rank = 0;
        var tied = false;
        for (var i = 0; i < users.length; i++) {
            tied = (i > 0 && users[i-1].points == users[i].points) 
            if (!tied) users[i].dataValues.rank = ++rank;
            else {
                users[i].dataValues.rank = (rank-1) + "T";
                users[i-1].dataValues.rank = (rank-1) + "T";
            }
        }

        callback(users, null);
    })
    .error(function(err) {
        callback(null, err);
    });
}

var getLeaderboardRequest = function(req, res) {
    var limit = req.query.limit;
    getLeaderboard(limit, function(leaders, err) {
        if (err) {
            console.log(JSON.stringify(err));
            res.write(JSON.stringify(err));
            res.end();
            return;
        }

        res.write(JSON.stringify(leaders));
        res.end();
    });
}

module.exports = {
    createQuestion: createQuestion,
    getQuestion: getQuestion,
    getAllQuestions: getAllQuestions,
    deleteQuestion: deleteQuestion,
    createAnswer: createAnswer,
    addPoints: addPoints,
    removePoints: removePoints,
    getAnswer: getAnswer,
    deleteAnswer: deleteAnswer,
    checkAnswer: checkAnswer,
    formatQuestion: formatQuestion,
    formatQuestions: formatQuestions,
    getPoints: getPoints,
    getLeaderboard: getLeaderboard,
    getLeaderboardRequest: getLeaderboardRequest
}
