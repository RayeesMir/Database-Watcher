'use strict';

var app = angular.module('notificationSystem', [
  'ui.router',
  'ngCookies'
]);

//auth interceptor
app.factory('AuthInterceptor', function($cookies,$location) {

  var interceptorFactory = {};
  // this will happen on all HTTP requests
  interceptorFactory.request = function(config) {
    // grab the token
    var token = $cookies.get('token');

    // if the token exists, add it to the header as x-access-token
    if (token)
      config.headers['x-access-token'] = token;

    return config;
  };

  interceptorFactory.response = function(response) {
    if(response.data.code == 401) {
      $cookies.remove('token');
      $cookies.remove('username');
      $cookies.remove('id');
      $location.path('/login');
    }
    return response;
  };

  return interceptorFactory;

});
app.run(['UserService','$cookies', function(UserService,$cookies) {

    UserService.getUser($cookies.id)
        .then(function(res){
            UserService.setUserProfile(res.data.message);
        });

}]);
app.config(function($stateProvider, $urlRouterProvider, $httpProvider,$locationProvider) {


  $httpProvider.interceptors.push('AuthInterceptor');
  $locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise('/login');
  $stateProvider
    .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginController'
    })
    .state('signup', {
      url: '/signup',
      templateUrl: 'views/signup.html',
      controller: 'UserController'
    })
    .state('profile', {
      templateUrl: 'views/profile.html', controller: 'HomeController'

    })
    .state('profile.detail', {
      url: '/profile',
      views: {
        'home': {
          templateUrl: 'views/profile-home.html',
          controller: 'HomeController'
        },
        'notifications': {
          templateUrl: 'views/profile-notification.html',
          controller: 'NotificationsController'
        },
        'friends': {
          templateUrl: 'views/following.html',
          controller: 'FriendsController'
        }
      }
    });
});