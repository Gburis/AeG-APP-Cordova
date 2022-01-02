(function(){
  'use strict';

  angular.module('appComponents')
    .directive('menu', menu);
  
  function menu(){
    return{
      restrict:'A',
      scope: false,
      templateUrl: 'views/components/menu/menu.html',
      controller: 'menuController'
    }
  }
})();