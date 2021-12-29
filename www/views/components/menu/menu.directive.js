(function(){
  'use strict';

  angular.module('homeComponents')
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