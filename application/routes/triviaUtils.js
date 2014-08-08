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
var answeranswer = function(req, res) {
}

// check an answer for correctness. returns true if correct, false otherwise
var checkAnswer = function(id, callback) {
    db.Answer.find({where: {id: id}})
    .success(function(answer) {
        db.Question.find({where: {id: answer.question_id}})
        .success(function(question) {
            if (question.answer == answer.answer) callback(true, null);
            else callback(false, null);
        })
        .error(function(err) {
            callback(false, err);
        });
    })
    .error(function(err) {
        callback(false, err);
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
            checkAnswer(answer.id, function(correct, err) {
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

    formatQuestion(user, questions[i], recursiveCallback);
}

module.exports = {
    createQuestion: createQuestion,
    getQuestion: getQuestion,
    getAllQuestions: getAllQuestions,
    deleteQuestion: deleteQuestion,
    createAnswer: createAnswer,
    getAnswer: getAnswer,
    answeranswer: answeranswer,
    checkAnswer: checkAnswer,
    formatQuestion: formatQuestion,
    formatQuestions: formatQuestions
}
