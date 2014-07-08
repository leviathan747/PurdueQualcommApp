// update the server and restart
exports.stopServer = function(req, res){
    if (req.body.ref == "refs/heads/master") {
        console.log("Received stop server signal. Exiting...");
        process.exit();
    }

    res.write(JSON.stringify(null));
    res.end();
}
