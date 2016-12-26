'use strict';
var path = require('path');
var UserModel = require(path.resolve('./app/models/user'));
var helper = require(path.resolve('./helpers/index'));
var SubscriptionModel = require(path.resolve('./app/models/subscription'));
var ConnectedClients = require(path.resolve('./app/models/connectedClients'));
var _ = require('lodash');


module.exports = {

    signup: function (request, response) {
        var newUser;
        //Helper Method for Validation in /helpers/index
        helper.validator(request, ["username", "email", "password"], "body")
            .then(function (data) {
                newUser = data;
                return UserModel.findUserByEmail(data.email, "+password +salt");
            })
            .then(function (user) {
                if (user) {
                    if (user.email == newUser.email)
                        throw helper.generateError(430);
                    if (user.mobile == newUser.mobile)
                        throw helper.generateError(431);
                }
                user = new UserModel(newUser);
                return user.save();
            })
            .then(function (user) {
                //set salt and password to undefined so that they are not encrypted with access-token
                user.salt = undefined;
                user.password = undefined;
                //generate access Token
                return helper.generateToken(user)
            })
            .then(function (result) {
                helper.sendSuccess(response, result);
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },
    login: function (request, response) {
        var credentials;
        helper.validator(request, ["email", "password"], "body")
            .then(function (data) {
                credentials = data;
                return UserModel.findUserByEmail(data.email, "+salt +password");
            })
            .then(function (user) {
                if (!user)
                    throw helper.generateError(423);
                if (!user.authenticate(credentials.password))
                    throw helper.generateError(423);
                user.salt = undefined;
                user.password = undefined;
                return helper.generateToken(user)
            })
            .then(function (result) {
                helper.sendSuccess(response, result);
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },
    getAllUsers: function (request, response) {
        UserModel.findAllUsers()
            .then(function (result) {
                helper.sendSuccess(response, result);
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },
    getUserById: function (request, response) {
        helper.interceptor(request, [], "body")
            .then(function (data) {
                var userId = data.user._id;
                return UserModel.findUserById(userId);
            })
            .then(function (result) {
                helper.sendSuccess(response, result);
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },
    /**
     * Method Used to Notify Dedicated Users
     * @param document
     * @param io
     */
    notifyUsers: function (document, io) {
        //get name of collection that has been manipulated
        var collectionName = document.ns.split('.')[1];
        //fetch all subscribers of particular collection
        SubscriptionModel.findSubscriptionByCollection(collectionName)
            .then(function (subscriptions) {
                var followers = [];
                //create array of followers
                _.each(subscriptions, function (follower) {
                    followers.push(follower.user);
                });
                //find online followers
                return ConnectedClients.findClientGroup(followers);
            })
            .then(function (onlineFollowers) {
                //send notification to all desired users
                console.log(onlineFollowers.length)
                _.each(onlineFollowers, function (socketId) {
                    if (io.sockets.connected[socketId])
                    //send data to desired clients
                        io.sockets.connected[socketId].emit('notification', {post: document});
                });
            })
            .catch(function (error) {
                console.log("inside notify users", error)
            })

    }
};
