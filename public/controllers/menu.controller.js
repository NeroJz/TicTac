angular.module('ticTacApp')
    .controller('menuCtrl', function($scope,$rootScope ,$http, $location){

        $scope.doLogout = function(){
            $http.get('/users/logout').success(function(){
                $rootScope.userLogged = false;
            }).error(function(err){
                $scope.alert = "Login failed";
            });

            $location.path('/users');
        };
    });