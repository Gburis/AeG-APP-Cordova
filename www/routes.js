angular.module('routes', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('login',{
      url: '/login',
      whitelisted: false,
      templateUrl: 'views/login.html',
      controller: 'loginController'
    })
    .state('home',{
      url: '/home',
      whitelisted: false,
      templateUrl: 'views/home.html',
      controller: 'homeController'
    });

  
    $urlRouterProvider.otherwise('/');
})