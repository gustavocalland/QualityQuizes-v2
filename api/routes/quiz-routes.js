var express = require('express');
var router  = express.Router();

var Quiz = require('../models/quiz-model');

router.get('/getAllQuizes', function(req, res){
    Quiz.getQuizList(function(err,quizes){
        if(err){throw err}
        res.json(quizes);
    })
});

router.post('/add',function(req,res){
    //PARECE QUE ISSO VEM DO FORM
    var quiz = req.body;
    Quiz.addQuiz(quiz, function(err, addedQuiz){
        if(err){throw err}
        res.json(addedQuiz);
    });
});

/*PARAMETROS
router.get('/algumacoisa/:parametro', function(req,res_{
    Quiz.mmetodo(req.params._parametro).........
})*/


module.exports = router;