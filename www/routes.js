angular.module('routes', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home',{
      url: '/home',
      templateUrl: 'views/home.html',
      controller: 'homeController'
    });
  
    $urlRouterProvider.otherwise('/home');
})