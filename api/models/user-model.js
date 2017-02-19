var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    firstName:String,
    lastName:String,
    email:{type: String, unique: true},
    phone:String,
    address:String,
    password:String,
});          

userSchema.statics.getByEmail = function(pEmail, callback){
    User.findOne({email: pEmail},callback);
}

userSchema.statics.getQuizTries = function(pId, callback){
    User.findById(pId, callback).select("quizTries");
}

var User = module.exports = mongoose.model('users',userSchema);