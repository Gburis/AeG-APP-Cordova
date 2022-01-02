(function(){
  angular.module('initApp',[
    'login',
    'home',
    'routes',
    'ngFileUpload',
    'ng-file-model',
    'ng-touch-hold',
    'ui.mask',
    'ui.utils.masks'
  ]).run(['$rootScope', '$timeout', '$window', '$state', '$http', function($rootScope, $timeout, $window, $state, $http){
      $rootScope.$on('$locationChangeStart', function(event) {
          $timeout(function(){
            const token = $window.localStorage.getItem('token');
            if (token){
              $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
              $state.go('home');
            } 
            else{
              $state.go('login');
            }
          });
      });

      $rootScope.$on('$login', function(event){
        $timeout(function(){
          const token = $window.localStorage.getItem('token');
          if (token){
            $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
            $timeout(function(){
              $state.go('home');
            },200);
          }
        });
      });

      $rootScope.$on('$logout', function(event) {
        $timeout(function(){
          $window.localStorage.removeItem('id');
          $window.localStorage.removeItem('nome');
          $window.localStorage.removeItem('token');
        });
      });

      setInterval(function(){
        const token = $window.localStorage.getItem('token');
        if (!token){
          $http.defaults.headers.common['Authorization'] = '';
          $state.go('login');
        }
      },100);
  }]);
})();
