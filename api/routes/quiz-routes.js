var express = require('express');
var router  = express.Router();

var Quiz = require('../models/quiz-model');
var QuizByUser = require('../models/quiz-user-model');

//  Gets a list of all quizes saved on Mongo. If there is a logged-in user (optional, because of the '*?'), gets all the 
//quiz tries and number of attempts he did for each quiz.
router.get('/getAllQuizes/:user*?', function(req, res){
    //Get all quizes saved on the server.
    Quiz.getAll(function(err,quizes){
        if(err){throw err}
        //After getting all quizes from the database, adds the number of tries and maxScore of the user that is currently logged to each quiz
        var itemsProcessed = 0;
        quizes.forEach(function(element) {
            QuizByUser.getQuizInfoByUser(req.params.user, element._id, function(err, result){
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

//Get all quiz tries/maxscore by a user
router.get('/getTries/:quizId/:userId', function(req, res){
    //Get all quizes saved on the server.
    QuizByUser.getQuizInfoByUser(req.params.userId, req.params.quizId, function(err, result){
        if(err){throw err}
        res.json(result);
    });
});

//Updates the number of tries done by a user
router.post('/insertUpdateTries/', function(req, res){
    var quizUser = new QuizByUser();
    console.log("O ID E = "+req.body.id);
        if(req.body.id != "undefined"){
            quizUser._id = req.body.id;
            //Required, otherwise the "save" method won't update
            quizUser.isNew = false;
        }
        quizUser.userId        = req.body.userId;
        quizUser.quizId        = req.body.quizId;
        quizUser.numberOfTries = req.body.numberOfTries;
        quizUser.maxScore      = req.body.maxScore;

        console.log(quizUser);

        quizUser.save().then(function (savedUser){
            console.log('The number of tries/maxscore for the quiz was saved/updated!');
            console.log(savedUser);
            res.json({savedUser});
        },function(err){
            res.json({error: err});
        });
});

// Generates a new quiz, with 10 randomly chosen questions of the quiz which ID was passed by parameter.
router.get('/generateRandomQuiz/:quizId', function(req,res){
    Quiz.getAllQuizQuestions(req.params.quizId,function(err, quiz){
        if(err){throw err}

        //Generates a new quiz object with only 10 questions, taken randomly from the original quiz
        for (qTriesIndex = 20; qTriesIndex > 10; qTriesIndex--) {
            var removedPosition = Math.floor(Math.random() * qTriesIndex);
            quiz.questions.splice(removedPosition, 1);
            shuffle(quiz.questions);
        }
        res.json(quiz);
    })
});

//Shuffles an array
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

module.exports = router;