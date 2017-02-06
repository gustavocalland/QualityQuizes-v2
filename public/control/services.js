qqApp.service('loginService', function() {
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

//Obtains data from the json
qqApp.service('storageService', function($http, $q){

    this.getQuizList = function () {

        return $q(function (resolve, reject) {

            $http.get("/listQuizes/").then(function(response) {
                resolve(response.data); 

            }, function(err) {
                reject(err);
            });            
        
        });

    };

    this.login = function (email, password) {

        return $q(function (resolve, reject) {

            $http(
                {
                    'method': 'POST',
                    'url': '/login/',
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

            $http.get('/logout/').then(function(response) {

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

    this.setScore = function (){

        
    }

    this.signUp = function (userJson) {

        return $q(function (resolve, reject) {

            $http(
                {
                    'method': 'POST',
                    'url': 'signUp/',
                    'data': 'firstName=' + userJson.firstName + 
                            '&lastName=' + userJson.lastName +
                            '&phone=' + userJson.phone +
                            '&address=' + userJson.address +
                            '&email=' + userJson.email +
                            '&password=' + userJson.password,
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

    
    function logError(error){
        console.log("ERROR: "+error);
    }

});