'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ConnectedClientsSchema = new Schema({
    socketId: {
        type: String,
        required: [true, 'Username is required']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }

}, {timestamps: true});

/**
 *  @returns {Promise|Array|{index: number, input: string}|Object|*|{npmUpdate}}
 */

ConnectedClientsSchema.statics.findAllClients = function () {
    return this
        .find({user: user})
        .exec();
};
/**
 * @param userId
 * @param socketId
 * @returns {Promise}
 */
ConnectedClientsSchema.statics.findClientBySocketId = function (userId, socketId) {
    return this
        .findOne({user: userId, socketId: socketId})
        .exec();
};
/**
 * @param socketId
 * @returns {Promise|Array|{index: number, input: string}|Object|*|{npmUpdate}}
 */
ConnectedClientsSchema.statics.removeClient = function (socketId) {
    return this
        .remove({socketId: socketId})
        .exec();
};
/**
 * @param userIds
 * @returns {Promise|Array|{index: number, input: string}|Object|*|{npmUpdate}}
 */
ConnectedClientsSchema.statics.findClientGroup = function (userIds) {
    var self=this;
    return new Promise(function (resolve,reject) {
         self.distinct('user',{user: {$in: userIds}}).exec(function (error,users) {
             if(error)
                 reject(error);
             else {
                 self.distinct('socketId',{user: {$in: users}}).exec(function (error,sockets) {
                     if(error)
                         reject(error);
                     else
                         resolve(sockets);
                 });
             }

         });
    });

};


module.exports = mongoose.model('ConnectedClients', ConnectedClientsSchema);

