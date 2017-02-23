qqApp.service('sessionStorageService', function() {
    this.isLoggedIn = function(){
        return sessionStorage.loggedInUser != null;
    };
    this.login = function(user){
        sessionStorage.setItem("loggedInUser",JSON.stringify(user));
    }
    this.logout = function(){
        sessionStorage.removeItem("loggedInUser");
    }
    this.getLoggedUser = function(){
        return JSON.parse(sessionStorage.getItem('loggedInUser'));
    }
});

// --- This service is used to obtain stored data from the server ---\\
qqApp.service('serverComunicationService', function($http, $q){
    //Get all quizes, so they can be displayed for user selection
    this.getAllQuizes = function (loggedInUserId) {
        return $q(function (resolve, reject) {
            var userId = loggedInUserId==null?"":loggedInUserId;
            $http.get("/quiz/getAllQuizes/"+userId).then(function(response) {
                resolve(response.data); 
            }, function(err) {
                reject(err);
            });            
        });
    };

    this.getRandomizedQuiz = function(quizId){
        return $q(function (resolve, reject) {
            $http.get("/quiz/generateRandomQuiz/"+quizId).then(function(response) {
                resolve(response.data); 
            }, function(err) {
                reject(err);
            });            
        });
    }

    this.getUserByEmail = function(email){
        return $q(function (resolve, reject) {
            $http.get("/user/getByEmail/"+email).then(function(response) {
                resolve(response.data); 
            }, function(err) {
                reject(err);
            });            
        });
    }

    //TODO -- FAZER UMA FUNCAO QUE PEGUE ISSO TUDO

    this.getQuizTries = function(quizId, userId){
        return $q(function (resolve, reject) {
            $http.get("/quiz/getTries/"+quizId+"/"+userId).then(function(response) {
                //Returns the found data or an empty quizTries object if nothing is found on the database
                var quizTries;
                if(response.data){
                    quizTries = response.data;
                }else{
                    quizTries = {
                        "quizId":quizId,
                        "userId":userId,
                        "numberOfTries":0,
                        "maxScore":"0/10"
                    };
                }

                resolve(quizTries); 
            }, function(err) {
                reject(err);
            });            
        });
    }

    this.updateQuizTries = function(quizTriesJson){
        return $q(function (resolve, reject) {
            $http(
                {
                    'method': 'POST',
                    'url': '/quiz/insertUpdateTries/',
                    'data':  
                        'id=' + quizTriesJson._id + 
                        '&password=' + quizTriesJson.password +
                        '&userId=' + quizTriesJson.userId +
                        '&quizId=' + quizTriesJson.quizId +
                        '&numberOfTries=' + quizTriesJson.numberOfTries +
                        '&maxScore=' + quizTriesJson.maxScore,
                    'headers': {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).then(function(response) {
                if (response.data.error) {
                    reject(response);
                }else{
                    resolve(response.data); 
                }
            }, function(err) {
                reject(err);
            });            
        });
    }
//});

//qqApp.service('authenticationService', function($http, $q){
    this.login = function (email, password) {
        return $q(function (resolve, reject) {
            $http(
                {
                    'method': 'POST',
                    'url': '/auth/login/',
                    'data':  'email=' + email + '&password=' + password,
                    'headers': {'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).then(function(response) {
                if (response.data.error) {
                    reject(response);
                }else{
                    resolve(response.data); 
                }
            }, function(err) {
                reject(err);
            });            
        });
    };

    this.logout = function () {
        return $q(function (resolve, reject) {
            $http.get('/auth/logout/').then(function(response) {
                if (response.data.error) {
                    reject(response);
                }else{
                    resolve(response.data); 
                }
            }, function(err) {
                //some error
                reject(err);
            });            
        });
    };

    this.signUp = function (user) {
        return $q(function (resolve, reject) {
            $http({
                'method': 'POST',
                'url': '/auth/signUp/',
                'data': 
                        'id=' + user.id +
                        '&firstName=' + user.firstName + 
                        '&lastName=' + user.lastName +
                        '&phone=' + user.phone +
                        '&address=' + user.address +
                        '&email=' + user.email +
                        '&password=' + user.password,
                'headers': {'Content-Type': 'application/x-www-form-urlencoded'}   
            }).then(function(response) {
                if (response.data.error) {
                    reject(response);
                }else{
                    resolve(response.data.savedUser); 
                }

            }, function(err) {
                reject(err);
            });            
        
        });

    };
});