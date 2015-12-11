var app = angular.module('ticTacApp', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider){
    $routeProvider
        .when('/login',{
            templateUrl: 'views/login.view.html'
        })
        .when('/register',{
            templateUrl: 'views/register.view.html'
        })
        .when('/users',{
            templateUrl: 'views/users.view.html'
        })
        .when('/gamelist',{
            templateUrl: 'views/gamelist.view.html'
        })
        .when('/leaderboard',{
            templateUrl: 'views/leaderboard.view.html'
        })
        .when('/gameplay',{
            templateUrl: 'views/gameplay.view.html',
        });

    $routeProvider.otherwise('/users');
}]);