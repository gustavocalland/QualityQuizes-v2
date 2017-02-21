var express = require('express');
var session = require('express-session');

var router  = express.Router();

var User = require('../models/user-model');
var sess;

router.get('/getUserByEmail',function(req, res){

});

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



router.post('/signUp',function(req,res){
    sess=req.session;

    var u = new User();
        u.id = req.body.id,
        u.firstName = req.body.firstName,
        u.lastName = req.body.lastName,
        u.email = req.body.email,
        u.phone = req.body.phone,
        u.address = req.body.address,
        u.password = req.body.password;

    u.save().then(function (savedUser){
        console.log('The user '+savedUser.email+' was saved!')
        res.json({savedUser});
    },function(err){
        res.json({error: err});
    });
});

module.exports = router;