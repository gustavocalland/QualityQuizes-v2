var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    phone:String,
    address:String,
    password:String,
});          

userSchema.statics.getByEmail = function(pEmail, callback){
    //Get a single user by his email. Doesnt get the quizTries array.
    User.findOne({email: pEmail},callback).select("-quizTries");
}

userSchema.statics.getQuizTries = function(pId, callback){
    User.findById(pId, callback).select("quizTries");
}

var User = module.exports = mongoose.model('users',userSchema);