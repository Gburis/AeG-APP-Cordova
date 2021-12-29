(function(){
  angular.module('ng-file-model', [])
    .directive("ngFileModel", ['$parse', function($parse){
      return{
        restrict: 'A',
        link: function(scope, element, attrs){
          const ngModel = $parse(attrs.ngFileModel);
          const modeSetter = ngModel.assign;
          element.bind('change',function(){
             scope.$apply(function(){
               modeSetter(scope, element[0].files[0]);
             })
          });
        }
      }
    }]);
})();