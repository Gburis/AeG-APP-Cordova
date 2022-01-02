(function(){
    'use strict';
    angular.module('appComponents')
      .directive('loadProgress', loadprogress);
    
    function loadprogress(){
      return{
        replace: true,
        restrict:'E',
        scope: false,
        templateUrl: 'views/components/progress/progress.html',
      }
    }
  })();