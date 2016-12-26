'use strict';

var app = angular.module('notificationSystem');

app.controller('NotificationsController', function ($scope, $cookies, UserService) {
    $scope.messages = [];
    var userProfile = UserService.getUserProfile();

    $scope.following = {
        name: userProfile.subscriptions
    };
    var token = $cookies.get('token');
    var socket = io.connect();
    socket.on('connect', function () {
        socket
            .emit('authenticate', {token: token})
            .on('authenticated', function () {
            })
            .on('unauthorized', function (msg) {
                console.log("unauthorized: " + JSON.stringify(msg.data));
                throw new Error(msg.data.type);
            })
    });
    socket.on('notification', function (data) {
        var post = data.post;
        $scope.$apply(function () {
            var message;
            var operation=post.op;
            var collectionName = post.ns.split('.')[1];
            switch(operation){
                case 'remove':
                    message={
                        collection:collectionName,
                        operation:post.op,
                        dataEffected:post.query._id,
                        client:post.client,
                        user:post.user,
                        time:post.ts
                    };
                    $scope.messages.push(message);
                    break;
                case 'insert':
                    message={
                        collection:collectionName,
                        operation:post.op,
                        dataEffected:post.query.documents._id,
                        client:post.client,
                        user:post.user,
                        time:post.ts
                    };
                    $scope.messages.push(message);
                    break;
                case 'update':

                    message={
                        collection:collectionName,
                        operation:post.op,
                        dataEffected:post.updateobj._id,
                        client:post.client,
                        user:post.user,
                        time:post.ts
                    };
                    $scope.messages.push(message);
                    break;
            }
        });
    });


});