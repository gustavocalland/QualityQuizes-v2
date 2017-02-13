qqApp.controller("navBarController", function($scope, $rootScope, $location, storageService, authenticationService) {

    init();

    function init(){
        $scope.userIsLoggedIn = authenticationService.isLoggedIn();

        if($scope.userIsLoggedIn){
            $scope.loggedInUser = authenticationService.getLoggedUser();
        }
    }

    $scope.logout = function()
    {

        storageService.logout().then(
            function(){
                
                $scope.userIsLoggedIn = false;
                $scope.loggedInUser = null;

                authenticationService.logout();
                $location.path('/');

                $scope.$emit('loginEvent', "user saiu");

            },function(){
                //nao deu logout
            }
        );
    }

    $rootScope.$on('loginEvent', function(event, message) {
        init();
    });

});

qqApp.controller("loginModalController", function($scope, $location, storageService, authenticationService) {
    $scope.invalidCredentials = false;

    $scope.login = function () {

        storageService.login($scope.emailInput, $scope.passwordInput).then(function(user){

            authenticationService.login(user);
            $location.path('/');
            
            $scope.$emit('loginEvent', "user entrou");

            //jquery bootstrap
            $('#loginModal').modal('hide');

            return true;

        },
        function(err){
            $scope.invalidCredentials = true;
        });

    }
});