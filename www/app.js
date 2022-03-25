(function(){
  angular.module('initApp',[
    'login',
    'home',
    'routes',
    'service',
    'ngFileUpload',
    'ng-file-model',
    'ng-touch-hold',
    'ui.mask',
    'ui.utils.masks'
  ]).run(['$rootScope', '$timeout', '$window', '$state', '$http', 'serviceFactory', function($rootScope, $timeout, $window, $state, $http, serviceFactory){
      $rootScope.$on('$locationChangeStart', function(event) {
          $timeout(function(){
            const token = $window.localStorage.getItem('token');
            if (token){
              $http.defaults.headers.common['Authorization'] = 'Bearer ' + token;
              serviceFactory.auth()
                .then(function(){
                  $state.go('home');
                })
                .catch(function(){
                  _logout();
                });
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
              const tokenDevice = $window.localStorage.getItem('tokenDevice');
              const id = $window.localStorage.getItem('id');

              if(tokenDevice){
                serviceFactory.device({
                  id: id,
                  token: tokenDevice,
                  date: new Date()
                }).then(function(){
                  $state.go('home');
                }).catch(function(){
                  $state.go('home');
                });
              }else{
                $state.go('home');
              }
            },200);
          }
        });
      });

      $rootScope.$on('$logout', function(event) {
        _logout();
      });

      function _logout(){
        $timeout(function(){
          $window.localStorage.removeItem('id');
          $window.localStorage.removeItem('nome');
          $window.localStorage.removeItem('token');
        });
      }

      setInterval(function(){
        const token = $window.localStorage.getItem('token');
        if (!token){
          $http.defaults.headers.common['Authorization'] = '';
          $state.go('login');
        }
      },100);

      function watchNotification(){
        console.log('teste')
      }
  }]);
})();
