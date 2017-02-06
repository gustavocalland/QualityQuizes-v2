//Controller used for the sign up and editing of user data
qqApp.controller("userFormController", function($scope, $location, loginService, storageService) {
    var currentUser=null;
    $scope.errorMessage = "";

    $scope.pageTitle = "Sign Up";
    $scope.pageMessage = "Join us today and answer thousands of quizes!";
    $scope.buttonTitle = "Sign up";

    $scope.firstNameInput = ""
    $scope.lastNameInput  = ""
    $scope.emailInput     = ""
    $scope.phoneInput     = ""
    $scope.addressInput   = ""
    
    $scope.passwordInput        = ""
    $scope.confirmPasswordInput = ""

    //If the user is logged in and is accessing this controller, it means that 
    // he is trying to edit his info
    if(loginService.isLoggedIn()){
        $scope.pageTitle = "My profile";   
        $scope.pageMessage = "";     
        $scope.buttonTitle = "Update my profile";

        currentUser = loginService.getLoggedUser();
        $scope.firstNameInput = currentUser.firstName;
        $scope.lastNameInput  = currentUser.lastName;
        $scope.emailInput     = currentUser.email;
        $scope.phoneInput     = currentUser.phone;
        $scope.addressInput   = currentUser.address;
    }

    $scope.signUp = function () {
        $scope.errorMessage = "";
        $scope.emailContainerClass = "";


        if ($scope.myForm.$invalid){
            $scope.errorMessage = "Please, fill all required fields!";
            return;
        }

        if($scope.passwordInput != $scope.confirmPasswordInput){
            $scope.errorMessage = "The passwords do not match.";
            $scope.emailContainerClass = "has-error"
            return;
        }


        var newUser = {
            "firstName":$scope.firstNameInput,
            "lastName":$scope.lastNameInput,
            "email":$scope.emailInput,
            "phone":$scope.phoneInput,
            "address":$scope.addressInput,
            "password":$scope.passwordInput
        };


        storageService.signUp(newUser).then(
            function (user) {

                loginService.login(user);

                $location.path('/');

                $scope.$emit('loginEvent', "user entrou");

            },
            function (err){
                $scope.errorMessage = err;
            }
        );

    }

});