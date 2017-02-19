var express = require('express');
var router  = express.Router();

var User = require('../models/user-model');

router.get('/getByEmail/:userEmail', function(req,res){
    User.getByEmail(req.params.userEmail,function(err, retrievedUser){
        if(err){throw err}
        res.json(retrievedUser);
    })
});

module.exports = router;