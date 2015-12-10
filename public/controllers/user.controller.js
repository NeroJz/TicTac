angular.module('ticTacApp')
    .controller('leaderboardCtrl', ['$scope', '$http',
    function($scope, $http){

        $http.get('/users/getUsers').success(function(data){
            $scope.users = data;
        });

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