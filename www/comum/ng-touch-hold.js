(function(){
  angular.module('ng-touch-hold', [])
    .directive('ngTouchHold', function($timeout) {
      var timer;
      return {
        restrict: 'A',
        link: function($scope, $elm, $attrs) {
          $elm.bind('touchstart', function(evt) {
            $scope.longPress = true;
            timer = $timeout(function() {
              if ($scope.longPress) {
                $scope.$apply(function() {
                  $scope.$eval($attrs.ngTouchHold);
                });
              }
            }, 600);
            timer;
          });

          $elm.bind('touchend', function(evt) {
            $scope.longPress = false;
            $timeout.cancel(timer);
            if ($attrs.onTouchEnd) {
              $scope.$apply(function() {
                $scope.$eval($attrs.ngTouchHold);
              });
            }
          });
        }
      };
    })
})();