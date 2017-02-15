var express = require('express');
var router  = express.Router();

var Quiz = require('../models/quiz-model');
var QuizDoneByUser = require('../models/quiz-user-model');

router.get('/getAllQuizes/:user*?', function(req, res){
    //Get all quizes saved on the server.
    Quiz.getAll(function(err,quizes){
        if(err){throw err}
        //After getting all quizes from the database, adds the number of tries and maxScore of the user that is currently logged to each quiz
        var itemsProcessed = 0;
        quizes.forEach(function(element) {
            QuizDoneByUser.getQuizInfoByUser(req.params.user, element._id, function(err, result){
                element.userTries = result;
                //Only returns the result after all the quizes have been processed
                itemsProcessed++;
                if(itemsProcessed==quizes.length){
                    res.json(quizes);
                }
            });
        });
    })
});

module.exports = router;