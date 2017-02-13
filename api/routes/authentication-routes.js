var express = require('express');
var session = require('express-session');

var router  = express.Router();

var User = require('../models/user-model');
var sess;

router.post('/login',function(req,res){
    sess=req.session;

    User.getByEmail(req.body.email, function (err, foundUser) {

        if (foundUser == null){
            res.json({error: 'user not found!'});
        }else{
            if (foundUser.password == req.body.password){
                sess.user = foundUser;
                res.json(foundUser);
            }else{
                res.json({error: 'user not found!'});
            }
        }

    })
});


router.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            res.json({error: err});
        } else {
            res.json({success: 'user logout!'});
        }
    });
});


/*
router.post('/signUp',function(req,res){
    sess=req.session;


    //lets make some validations here


    myMongo.find(myMongo.db.collection('users'), {'email': req.body.email}, function (err, foundItems) {

        if (foundItems.length > 0){ 
            if (sess.user){
                if (sess.user._id != foundItems[0]._id){
                    res.json({error: 'This e-mail is already registered. Try loggin in.'});
                    return;
                }
            }else{
                res.json({error: 'This e-mail is already registered. Try loggin in.'});
                return;
            }
        }


        var user = {
            "firstName":req.body.firstName,
            "lastName":req.body.lastName,
            "email":req.body.email,
            "phone":req.body.phone,
            "address":req.body.address,
            "password":req.body.password,
            "quizTries" : (sess.user) ? sess.user.quizTries : []
        };

        if (sess.user){
            myMongo.update(myMongo.db.collection('users'), { 'email': sess.user.email },
                                        { $set: 
                                            {
                                                "firstName":req.body.firstName,
                                                "lastName":req.body.lastName,
                                                "email":req.body.email,
                                                "phone":req.body.phone,
                                                "address":req.body.address,
                                                "password":req.body.password,
                                                "quizTries" : (sess.user) ? sess.user.quizTries : []
                                            }
                                        },
                                        { multi: false },
                                        function (err, numReplaced) {
                                            if (err) return res.json({error: err});
                
                                            res.json(user);
                                        });
        }else{

            myMongo.insert(myMongo.db.collection('users'), user, function (err){
                if (err) return res.json({error: err});
                
                res.json(user);
            });

        }

    });

});*/

module.exports = router;