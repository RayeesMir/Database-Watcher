'use strict';

var app = angular.module('notificationSystem');

app.controller('HomeController', function($scope, $state,$cookies,$window, UserService) {

    var user=UserService.getUserProfile();
    if(user){
      $scope.profile = {
            username: user.username,
            email: user.email            
          };
          if(user.subscriptions.length)
              $scope.profile.following=user.subscriptions.length;
          else
              $scope.profile.following=0;
          
        $scope.status = {
        username: $scope.profile.username,
        status: ''
      };
    }
    $scope.logout = function() {
        $cookies.put('username', '');
        $cookies.put('email', '');
        $cookies.put('followers.length', '');
        $cookies.put('following.length', '');
        $state.go('login');
    };
    // $scope.update = function() {
    //     var post={post:$scope.post};
    //     UserService.updateStatus(post)
    //         .success(function(response) {
    //             console.log(response);
    //             if(response.status === 'success') {
    //                 alert('status updated');
    //             } else {
    //                 alert('error');
    //             }
    //         });
    // };
});