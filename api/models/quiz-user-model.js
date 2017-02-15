var mongoose = require('mongoose');

var quizUserSchema = mongoose.Schema({
    quizId:mongoose.Schema.Types.ObjectId,
    userId:mongoose.Schema.Types.ObjectId,
    numberOfTries:{type:Number, default:0},
    maxScore:String
});

quizUserSchema.statics.getQuizInfoByUser = function(userId, quizId, callback){
     this.findOne({"userId":userId, "quizId":quizId}).select('numberOfTries maxScore').exec(callback);
}

var QuizByUser = module.exports = mongoose.model('quizusers',quizUserSchema);