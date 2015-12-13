angular.module('ticTacApp', ['ngRoute'])
    .run(function ($rootScope) {
        $rootScope.loggedUser = false;
        $rootScope.currentUser = "";
        $rootScope.currentGame = "";
    })
    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/login.view.html',
                controller: 'UserLoginCtrl'
            })
            .when('/register', {
                templateUrl: 'views/register.view.html',
                controller: 'RegisterUserCtrl',
            })
            .when('/users', {
                templateUrl: 'views/users.view.html',
                controller: 'leaderboardCtrl'
            })
            .when('/gamelist', {
                templateUrl: 'views/gamelist.view.html'
            })
            .when('/leaderboard', {
                templateUrl: 'views/leaderboard.view.html',
                controller: 'leaderboardCtrl',
            })
            .when('/gameplay', {
                templateUrl: 'views/gameplay.view.html',
                controller: 'gameplayCtrl'
            })
            .when('/gamelist',{
                templateUrl: 'views/gamelist.view.html',
                controller: 'gamelistCtrl'
            })
            .when('/continue/:gameid',{
                templateUrl: 'views/gameplay.view.html',
                controller: 'gameContinueCtrl'
            })
            .otherwise({redirectTo:'/'});
    }]);