'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
var SubscriberSchema = new Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'User is required']
    },
    collectionName: {
        type: String,
        required: [true, 'Collection is required']
    },
    fields: [String],
    operation: {
        type: String,
        enum: ['insert', 'update', 'delete', 'all'],
        default: 'all'
    }
}, {timestamps: true});
/**
 * @param user
 * @returns {*|{npmUpdate}|Array|{index: number, input: string}|Object|Promise}
 */
SubscriberSchema.statics.findAllSubscriptionsOfUser = function (user) {
    return this
        .find({user: user})
        .exec();
};
/**
 * @param collection
 * @returns {Promise}
 */
SubscriberSchema.statics.findSubscribersOfCollection = function (collection) {
    return this
        .findOne({collectionName: collection})
        .populate([{
            path: "user",
            model: 'User'
        }])
        .exec();
};
/**
 *
 * @param user
 * @param collection
 * @returns {Promise}
 */
SubscriberSchema.statics.checkSubscription = function (user, collection) {
    return this.findOne({user: user, collectionName: collection}).exec();
};
/**
 *
 * @param subscriptionId
 * @returns {Promise}
 */
SubscriberSchema.statics.findSubscriptionById = function (subscriptionId) {
    return this.findOne({_id: subscriptionId}).exec();
};
/**
 *
 * @param collectionName
 * @returns {*|{npmUpdate}|Array|{index: number, input: string}|Object|Promise}
 */
SubscriberSchema.statics.findSubscriptionByCollection = function (collectionName) {
    return this.find({collectionName: collectionName}).exec();
};
/**
 * @param user
 * @param subscription
 * @returns {Promise}
 */
SubscriberSchema.statics.updateSubscription = function (user, subscription) {
    return this.update({
        user: user,
        collectionName: subscription.collection
    }, {$set: {fields: subscription.fields}}).exec();
};

module.exports = mongoose.model('Subscription', SubscriberSchema);