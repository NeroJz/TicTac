(function(){
    angular.module('ticTacApp')
        .factory('Auth', ['$rootScope', '$http', function($rootScope, $http){
            return{
                getCurrentUser : function(){
                    return $http.get('/users/currentUser');
                }
            }
        }]);
})();