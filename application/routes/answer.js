var db = require('../models').db;

// create answer
exports.createAnswer = function(req, res) {
    var answer = req.body.answer.trim();
    var email = req.body.email.trim();
    var question_id = req.body.question_id.trim();

    
    // find answer; If no answer of this kind exists create it
    db.Answer.find({where: {answer: answer}})
    .success(function(newAnswer) {
        if (!newAnswer) {

            // create answer in DB
            db.Answer.create({ answer:answer, email: email, question_id: question_id})
            .success(function(answer) {
                console.log(answer);
            }).error(function(err){
                console.log(JSON.stringify(err));
            });
   
        } 

        else {
           req.session.answerMessage = 'Oops! answer already exists!';
           res.write('/createAnswer');
           res.end();
        }
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
    });
}

//get answer
exports.getAnswer = function(req, res) {

    var email = req.body.email.trim();

    // find answer
    db.Answer.find({where: {email: email}})
    .success(function(answer) {
        if (!answer) {
            req.session.answerMessage = 'Answer does not exist';
            res.write('/createAnswer');
            res.end();
        }
        
        else {
            console.log(answer);
        }
    })
    .error(function(err) {
        console.log(JSON.stringify(err));
    });
}

// delete answer
// TODO
exports.answeranswer = function(req, res) {

}
