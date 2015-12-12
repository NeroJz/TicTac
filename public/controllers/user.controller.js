angular.module('ticTacApp')
    .controller('leaderboardCtrl', ['$scope', '$http', '$rootScope', 'Auth',
    function($scope, $http, $rootScope, Auth){
        console.log($rootScope.currentUser);

        $http.get('/users/getUsers').success(function(data){
            $scope.users = data;
        });

    }])
    .controller('UserLoginCtrl', ['$scope', '$http', '$rootScope', '$location',
    function($scope, $http, $rootScope, $location){
        $scope.doLogin = function(){
            var login_data = {
                username: $scope.username,
                password: $scope.password
            };

            $http.post('/users/login', login_data)
                .success(function(data){
                    $rootScope.currentUser = data;
                    $rootScope.loggedUser = true;
                    $location.path('/leaderboard');
                })
                .error(function(data){
                    $scope.alert = "Opps, invalid username or password."
                });
        };

    }])
    .controller('RegisterUserCtrl', ['$scope', '$http', '$location',
        function ($scope, $http, $location) {

            $scope.registerUser = function(){
                var data = {
                    username: $scope.username,
                    password: $scope.password,
                    password2: $scope.password2
                };

                $http.post('/users/register', data)
                    .success(function(data, status, header, config){
                        console.log(data);
                        $location.path('/users');
                    })
                    .error(function(data, status, header, config){
                        $scope.errors = data;
                    });
            };

        }]);