qqApp.controller("menuController", function ($scope, $rootScope, $http, serverComunicationService, sessionStorageService) {
    
    init();

    //When a login event is detected, calls the init function
    $rootScope.$on('loginEvent', function(event, message) {
        init();
    });

    function init(){
        $scope.showLoginRequiredAlert = false;
        $scope.userIsLoggedIn = sessionStorageService.isLoggedIn();

        loadQuizes();
    }

    //Gets all quizes from the database
    function loadQuizes(){
        var user = sessionStorageService.getLoggedUser();
        serverComunicationService.getAllQuizes(user==null?"":user._id).then(
            function(quizList) {
                $scope.quizList = quizList;
            }, 
            function(reason) {
                console.error("Error obtaining quiz list: "+reason.data);
                throw reason;
            }
        );
        
    };
    
    //This function takes a quiz object (definied in the JSON) and generates a new quiz object 
    // with only 10 questions, taken randomly from the original quiz
    $scope.generateQuiz = function (selectedQuiz, event) {
        if(sessionStorageService.isLoggedIn()){
            serverComunicationService.getRandomizedQuiz(selectedQuiz._id).then(
                function(randomizedQuiz){
                    //set the generate quiz to $rootScope so the quizController can get it
                    $rootScope.generatedQuiz = randomizedQuiz;
                    console.log($rootScope.generatedQuiz);
                }
            );
            console.log("ASYNCH!!");
        }else{
            //Cancels the redirect to the next page and demands login
            $scope.showLoginRequiredAlert = true;
            event.preventDefault();
        }       
    }
});