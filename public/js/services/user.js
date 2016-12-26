'use strict';

var app = angular.module('notificationSystem');

app.factory('UserService', ['$http', function($http) {
  var UserProfile = {};

  return {
    getPeople: function() {
      return $http.get('/api/users');
    },

    signup: function(data) {
      return $http.post('/api/users', data);
    },

    getCollections:function () {
      return $http.get('api/collections')
    },

    getUser: function(id) {
      return $http.get('/api/users/' + id);
    },

    subscriber: function(user) {
      return $http.post('/api/collections/subscribe', user);
    },

    unsubscriber: function(user) {
      return $http.post('/api/collections/unsubscribe', user);
    },

    getUserProfile: function() {
      return UserProfile;
    },

    setUserProfile: function(user) {
      UserProfile = user;
    },
    
    updateUserProfile: function(subscription) {
      if(subscription)
          UserProfile.subscriptions.push(subscription)  ;
        console.log("userProfile",UserProfile)
    }
  };
}]);