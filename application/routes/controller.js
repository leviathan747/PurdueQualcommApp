var triviaUtils = require('./triviaUtils');

// update the server and restart
exports.stopServer = function(req, res){
    if (req.body.ref == "refs/heads/master") {
        console.log("Received stop server signal. Exiting...");
        process.exit();
    }

    res.write(JSON.stringify(null));
    res.end();
}

// TRIVIA REQUESTS

// answer a question
exports.answerQuestion = function(req, res) {
    var answer = "";
    if (req.body.a) answer = "a";
    else if (req.body.b) answer = "b";
    else if (req.body.b) answer = "c";
    else answer = "d";

    var user = Number(req.session.user.id);
    var question = Number(req.body.question);

    if (!answer || !user || !question) {
        console.log("Error answering the question");
        res.redirect("/trivia");
        return;
    }

    triviaUtils.createAnswer(user, question, answer, function(err) {
        if (err) {
            console.log(JSON.stringify(err));
            res.redirect("/trivia");
            return;
        }

        res.redirect("/trivia/" + question);
    });

}
