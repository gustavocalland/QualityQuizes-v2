var mongoose = require('mongoose');

var quizSchema = mongoose.Schema({
    title:String,
    description:String,
    questions:[{
        title:String,
        answers:[String],
        correctAnswer:Number
    }],
});

//Get all quizes, but only the id, title and description fields
quizSchema.statics.getAll = function(callback){
    //lean() returns the data as a javascript object, that can be edited later
    this.find().select('title description').lean().exec(callback);  
}

var Quiz = module.exports = mongoose.model('quizes',quizSchema);