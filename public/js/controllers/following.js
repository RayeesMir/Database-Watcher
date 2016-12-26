'use strict';

var app = angular.module('notificationSystem');

app.controller('FriendsController', function ($scope, $cookies, UserService) {
    // var userId = $cookies.get('id');
    // var userName = $cookies.get('username');
    var userProfile = UserService.getUserProfile();
    $scope.profile = {
        username: userProfile.username,
        following: userProfile.subscriptions
    };
    UserService.getCollections()
        .success(function (response) {
            $scope.collections = response.message;
            angular.forEach($scope.collections, function(collection) {
                angular.forEach($scope.profile.following, function(subscription) {
                    console.log(collection);
                    if(!collection.isFollowing){
                        if(collection.name === subscription.collectionName)
                            collection.isFollowing = true;
                        else
                            collection.isFollowing = false;
                    }
                });
            });
        });

    $scope.subscribe = function (name) {
        var data={collectionName :name};
        UserService.subscriber(data)
            .success(function (response) {
                UserService.updateUserProfile(response.message);
            });
    };

    $scope.unSubscribe = function (name) {
        var data={collectionName :name};
        UserService.unsubscriber(data)
            .success(function (response) {
                UserService.updateUserProfile(response.message);
            });
    };


});