qqApp.controller("navBarController", function($scope, $rootScope, $location, serverComunicationService, sessionStorageService) {

    init();

    function init(){
        $scope.userIsLoggedIn = sessionStorageService.isLoggedIn();

        if($scope.userIsLoggedIn){
            $scope.loggedInUser = sessionStorageService.getLoggedUser();
        }
    }

    $scope.logout = function()
    {

        serverComunicationService.logout().then(
            function(){
                
                $scope.userIsLoggedIn = false;
                $scope.loggedInUser = null;

                sessionStorageService.logout();
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

qqApp.controller("loginModalController", function($scope, $location, serverComunicationService, sessionStorageService) {
    $scope.invalidCredentials = false;

    $scope.login = function () {

        serverComunicationService.login($scope.emailInput, $scope.passwordInput).then(function(user){

            sessionStorageService.login(user);
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