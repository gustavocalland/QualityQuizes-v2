var express    = require('express');
var app = express();

var session    = require('express-session');
var bodyParser = require('body-parser');
var mongoose   = require('mongoose');

//--- Initializing the connection to the database ---\\
//mongoose.Promise = global.Promise; // ==> Using this because the default promisse of mongoose is depracated and gives annoying warnings
mongoose.connect("mongodb://127.0.0.1:27017/QualityQuizes");

//--- Initializing the other dependencies ---\\
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())        
app.use(session({
    secret: '687815835813586836981',
    resave: false,
    saveUninitialized: true}
));

//--- Initializing the routes ---\\
var quizRoutes = require('./api/routes/quiz-routes');
var userRoutes = require('./api/routes/user-routes');
var authRoutes = require('./api/routes/authentication-routes');
var initRoutes = require('./api/routes/init-routes');

app.use('/quiz', quizRoutes); 
app.use('/user', userRoutes); 
app.use('/auth', authRoutes);
app.use('/init', initRoutes);

app.use(express.static('public'));

//not found, go to root
app.get('*', function(req, res){
    res.redirect('/');
});

app.listen(3000, function (err) {
    if(err){throw err}
    console.log('Quality Quizes listening on port 3000!')
});