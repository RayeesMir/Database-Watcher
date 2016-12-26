var path = require('path');
var SubscriptionModel = require(path.resolve('./app/models/subscription'));
var UserModel = require(path.resolve('./app/models/user'));

var helper = require(path.resolve('./helpers/index'));
var _ = require('lodash');

function Subscriber() {
}

Subscriber.prototype = {
    /**
     * Update Subscription Of particular User
     * @param user
     * @param subscription
     * @returns {Promise}
     */
    updateSubcription: function (user, subscription) {
        return new Promise(function (resolve, reject) {
            SubscriptionModel.updateSubcription(user, subscription)
                .then(function (user) {
                    resolve(user);
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    },
    /**
     * Save User Subscription
     * @param user
     * @param subscription
     * @returns {Promise}
     */
    subscribeToCollection: function (user, subscription) {
        return new Promise(function (resolve, reject) {
            var savedSubscription;
            SubscriptionModel.checkSubscription(user, subscription.collection)
                .then(function (result) {
                    if (result)
                        throw helper.generateError(420);
                    else
                        return new SubscriptionModel(subscription).save();
                })
                .then(function (subscription) {
                    savedSubscription = subscription;
                    return UserModel.findUserById(user)
                })
                .then(function (user) {
                    user.subscriptions.push(savedSubscription._id);
                    return user.save();
                })
                .then(function (user) {
                    var subscriptions = user.subscriptions;
                    var subscription = _.find(subscriptions, function (subscription) {
                        return subscription == savedSubscription._id;
                    });
                    return SubscriptionModel.findSubscriptionById(subscription);
                })
                .then(function (subscription) {
                    resolve(subscription);
                })
                .catch(function (error) {
                    reject(error);
                })
        })
    }
};

var Subscription = new Subscriber();

module.exports = {

    subscribe: function (request, response) {
        //Token Validation and input validation
        helper.interceptor(request, ["collectionName"], "body")
            .then(function (data) {
                var collectionName = data.input.collectionName;
                var user = data.user._id;
                var subscription = {
                    user: user,
                    collectionName: collectionName
                    // ,
                    // fields:data.input.fields,    //Pending because of front end
                    // operation:input.operation
                };
                return Subscription.subscribeToCollection(user, subscription);
            })
            .then(function (result) {
                helper.sendSuccess(response, result)
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    },

    unSubscribe: function (request, response) {
        helper.interceptor(request, ["collectionName"], "body")
            .then(function (data) {
                var collection = data.input.collectionName;
                var user = data.user._id;
                return SubscriptionModel.remove(user, collection);
            })
            .then(function (result) {
                helper.sendSuccess(response, result)
            })
            .catch(function (error) {
                console.log(error);
                helper.sendError(response, error);
            })
    }
};