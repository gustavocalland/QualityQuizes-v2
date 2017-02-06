var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var app = express();
var sess;

var myMongo = require('./api/mongodb.js').
    init({mongoDatabase: "mongodb://127.0.0.1:27017/QualityQuizes"}, 
        function (err) {
            if (err) { throw err; }

            initialized = true;
        });



app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())        


app.use(session({
    secret: '687815835813586836981',
    resave: false,
    saveUninitialized: true}
));


app.use(express.static('public'));



app.get('/listQuizes',function(req,res){

    myMongo.find(myMongo.db.collection('quizes'), {}, function (err, foundItems) {

        res.json(foundItems);

    });

});


app.post('/login',function(req,res){
    sess=req.session;

    myMongo.find(myMongo.db.collection('users'), {'email': req.body.email}, function (err, foundItems) {

        if (foundItems.length <= 0){
            res.json({error: 'user not found!'});
        }else{
            if (foundItems[0].password == req.body.password){
                sess.user = foundItems[0];
                res.json(foundItems[0]);
            }else{
                res.json({error: 'user not found!'});
            }
        }

    });

});


app.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            res.json({error: err});
        } else {
            res.json({success: 'user logout!'});
        }
    });
});



app.post('/signUp',function(req,res){
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

});

app.get('/setScore',function(req,res){
    sess=req.session;
    if (sess.user){
        //gravar score
    }else{
        //response com erro
    }

});

app.get('/resetDatabase',function(req,res){

    myMongo.remove(myMongo.db.collection('quizes'), {}, {}, function (err){

        var arrQuizes = [{
            "id":0,
            "title" :"Swift programming",
            "description" :"Test whether you know it or not!",
            "questions" : [
                {"title" :"Which keyword do you use to declare enumeration?","answers" :[
                    "var","let","enum","e(num)"],"correctAnswer" :2},
                {"title" :"Which of the following declares a mutable array in Swift?","answers" :[
                    "let x = [Int]()","var x = [Int]","var x = [Int]()","let x = [Int]"],"correctAnswer" :1},
                {"title" :"Which of these is not a valid property declaration in Swift?","answers" :[
                    "final let x = 0","final lazy let x = 0","final lazy var x = 0","final var x = 0"],"correctAnswer" :1},
                {"title" :"All Swift classes must inherit from which root class?","answers" :[
                    "Not Required","NSObject","NSRootObject","@ObjC"],"correctAnswer" :0},
                {"title" :"What would be used for safe casting and to return nil if failed?","answers" :[
                    "as?","as!","!as?","!as!"],"correctAnswer" :0},
                {"title" :"When declaring an enumeration, multiple member values can appear on a single line, separated by which punctuation mark?","answers" :[
                    "Semi-colon","Colon","Comma","Question Mark"],"correctAnswer" :2},
                {"title" :"Which keyword in the context of a Switch statement is required to force the execution of a subsequent case?","answers" :[
                    "Fallthrough","Continue","Release","DropEnd"],"correctAnswer" :0},
                {"title" :"Which keyword is used on a function in an enumeration to indicate that the function will modify 'self'?","answers" :[
                    "modifier","mutating","mutable","mod"],"correctAnswer" :1},
                {"title" :"What is the name of the deinitializer in a Class declaration?","answers" :[
                    "dealloc","release","dint","deinit"],"correctAnswer" :3},
                {"title" :"Which of the following statements could be used to determine if a given variable is of String type?","answers" :[
                    "if unknownVariable is String { }","if unkownVariable: String { }","if unkownVariable = String() { }","if unkownVariable <> String[] { }"],"correctAnswer" :0},
                {"title" :"What is i data type? let i = 10.2","answers" :[
                    "Double","Float","Decimal","Int"],"correctAnswer" :0},
                {"title" :"How do you write OK to console?","answers" :[
                    "console.log(\"OK\");","log(\"OK\");","write(\"OK\");","print(\"OK\");"],"correctAnswer" :3},
                {"title" :"How many bits are used to store an Int?","answers" :[
                    "8-bit","16-bit","32-bit","It depends on the device"],"correctAnswer" :3},
                {"title" :"Which company developed swift language?","answers" :[
                    "Apple","Google","Microsoft","Oracle"],"correctAnswer" :0},
                {"title" :"When swift became publicly?","answers" :[
                    "2012","2013","2014","2015"],"correctAnswer" :2},
                {"title" :"How to exit from a loop in swift?","answers" :[
                    "stop","exit","break","end"],"correctAnswer" :2},
                {"title" :"What statement causes all remaining code in a loop to be skipped?","answers" :[
                    "skipp","continue","break","loop"],"correctAnswer" :1},
                {"title" :"What is i data type? let i = 10","answers" :[
                    "Double","Float","Decimal","Int"],"correctAnswer" :3},
                {"title" :"Who was the person who invented swift? ","answers" :[
                    "Bill gates","Chris Lattner","Steve Jobs","Jony Ive"],"correctAnswer" :1},
                {"title" :"In which IDE can you debug swift apps?","answers" :[
                    "Visual Studio","XStudio","Xcode","Apple Studio"],"correctAnswer" :2}
            ]
        },
        
        {
            "id":1,
            "title" :"Animal kingdom",
            "description" :"Test your zoological knowledge by taking this animal quiz!",
            "questions" :[
                {"title" :"Which of these animals is not a mammal?","answers" :["Cat","Dog","Penguin","Dolphin"],"correctAnswer" :2},
                {"title" :"Which of these animals can be found in the Amazon rainforest?","answers" :["Capybara", "Tiger", "Gorilla", "Chimpanzee"],"correctAnswer" : 0},
                {"title" :"Which of these animals is not a fish?","answers" :["Barracuda", "Whale", "Tuna", "Salmon"],"correctAnswer" : 1},
                {"title" :"Which of these animals is not a herbivore?","answers" :["Horse", "Cow", "Duck", "Gazelle"],"correctAnswer" : 2},
                {"title" :"Which of these birds is dangerous to humans?","answers" :["Owl", "Pigeon", "Chicken", "Cassowary"],"correctAnswer" : 3},
                {"title" :"Which of these animals can not be found on the south pole?","answers" :["Polar bear", "Seal", "Penguin", "Albatross"],"correctAnswer" : 0},
                {"title" :"Which of these animals communicates by chirping?","answers" :["Hermit Crab", "Goldfish", "Snake", "Rabbit"],"correctAnswer" : 0},
                {"title" :"Which of these animals can talk?","answers" :["Chicken", "Cat", "Dog", "Parrot"],"correctAnswer" : 3},
                {"title" :"Which of these animals does not live in the african savanna?","answers" :["Leopard", "Lion", "Tiger", "Cheetah"],"correctAnswer" : 2},
                {"title" :"An invertebrate is an animal....","answers" :["without a backbone", "who can breathe under water", "who have only a single cell", "that have a shell"],"correctAnswer" : 0},
                {"title" :"Whitch of the listed information is NOT true for all birds?","answers" :["They are warm blooded", "They can fly", "They lay eggs", "They have feathers"],"correctAnswer" : 1},
                {"title" :"Amphibians...","answers" :["Have a scaly and dry skin", "Live under the sea", "Are warm blooded", "Lay eggs"],"correctAnswer" : 3},
                {"title" :"Which of these animals is a carnivore?","answers" :["Cow", "Wolf", "Elephant", "Panda Bear"],"correctAnswer" : 1},
                {"title" :"Reptiles...","answers" :["Are warm blooded", "Have dry scaly skin", "Feed the young on milk", "Are poisonous"],"correctAnswer" : 1},
                {"title" :"Fish...","answers" :["Are herbivores", "Can't be found in the south pole", "Have scales on their body", "Are warm blooded"],"correctAnswer" : 2},
                {"title" :"Whitch of the following animals can live the longest?","answers" :["Giant tortoise", "Kangaroo", "Rat", "Elephant"],"correctAnswer" : 0},
                {"title" :"Which of these animals is known for building dams?","answers" :["Badgers", "Platypus", "Sloth", "Beavers"],"correctAnswer" : 3},
                {"title" :"Whitch of these species is considered endangered and risks extinction?","answers" :["Orangutan ", "Kangaroo", "Pigeon", "Shark"],"correctAnswer" : 0},
                {"title" :"Whitch of these animals does not live underground?","answers" :["Mole", "Owl", "Ant", "Earthworm"],"correctAnswer" : 2},
                {"title" :"Which of these animals eats carrion?","answers" :["Hyena", "Lion", "Gazelle", "Leopard"],"correctAnswer" : 0}
            ]
        }];


        myMongo.insert(myMongo.db.collection('quizes'), arrQuizes, function (){

            myMongo.remove(myMongo.db.collection('users'), {}, {}, function (err){

                var user = {
                    "id":1,
                    "firstName":"Gustavo",
                    "lastName":"Leite",
                    "email":"gustavocalland@gmail.com",
                    "phone":"(647) 111-1111",
                    "address":"Toronto - P1P HWI",
                    "password":"123456",
                    "quizTries" :[
                        {"quizId" :0,"numberOfTries":6,"maxScore":"4/10"},
                        {"quizId" :1,"numberOfTries":2,"maxScore":"2/10"}
                    ]
                };                

                myMongo.insert(myMongo.db.collection('users'), user, function (){

                    res.send("database reseted!");

                });

            });

        }); 

    });

});


//not found, go to root
app.get('*', function(req, res){
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});