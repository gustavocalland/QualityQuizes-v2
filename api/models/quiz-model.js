var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({
    title:String,
    description:String,
    questions:[{
        title:String,
        answers:[String],
        correctAnswer:Number
    }],

    userTries:[{
        userId:mongoose.Schema.Types.ObjectId,
        numberOfTries:{type:Number, default:0},
        maxScore:String
    }]
});

//Get all quizes, but only the id, title and description fields
quizSchema.statics.getQuizList = function(loggedUserId,callback){
    var query = this.find().select('title description');
    
    if(loggedUserId!=null){
        query.select("userTries");
        query.find({"userTries.userId":loggedUserId});
    }
    
    query.exec(callback);
}

var Quiz = module.exports = mongoose.model('quizes',quizSchema);