var db = require('../models').db;

// create question
exports.createQuestion = function(req, res) {
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
exports.getQuestion = function(req, res) {

    var id = req.body.id.trim();

    // find question
    db.Question.find({where: {question_id: id}})
    .success(function(question) {
        if (!question) {
            req.session.questionMessage = 'Question does not exist';
            res.write('/createQuestion');
            res.end();
        }
        
        else {
            console.log(question);
        }
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
    });
}

// delete question
// TODO
exports.deleteQuestion = function(req, res) {

}
