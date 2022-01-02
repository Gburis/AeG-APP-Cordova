(function(){
  angular.module('login', ['appComponents'])
    .controller('loginController', function($scope, $rootScope, $window, serviceFactory, $state, $timeout){
      $scope.loadProgess = false;
      $scope.saveDadosUser = false;
      const service = serviceFactory;
      $scope.user = {};

      _init();

      function _init(){
        const username = $window.localStorage.getItem('username', $scope.user.username);
        const password = $window.localStorage.getItem('password', $scope.user.password);
        if(username) $scope.user.username = username;
        if(password) $scope.user.password = password;

        if(username && password){
          $timeout(function(){
            document.getElementById('username').focus();
            document.getElementById('password').focus();
          },500);

          $scope.saveDadosUser = true;
        }

      }

      $scope.login = function(){
        $scope.loadProgess = true;
        service.login($scope.user)
          .then(function(result){
            result = result.data;
            if(result.success){
              $window.localStorage.setItem('id', result.data.user.id);
              $window.localStorage.setItem('nome', result.data.user.nome);
              $window.localStorage.setItem('token', result.data.user.token);

              if($scope.saveDadosUser){
                $window.localStorage.setItem('username', $scope.user.username);
                $window.localStorage.setItem('password', $scope.user.password);
              }  
              $scope.loadProgess = false;

              $rootScope.$broadcast('$login');
                
            }else{
              M.toast({html: result.data.msg, classes: 'red rounded center'});
              $scope.loadProgess = false;
            }
          })
          .catch(function(err){
            console.log(err)
            M.toast({html: 'Usuario invalido !', classes: 'red rounded center'});
            $scope.loadProgess = false;
          })
      }

    });
})();