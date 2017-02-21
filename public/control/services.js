qqApp.service('sessionStorageService', function() {
    this.isLoggedIn = function(){
        return sessionStorage.loggedInUser != null;
    };
    this.login = function(user){
        console.log(user);
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