/**
 * Created by mir on 25/12/16.
 */
var path = require('path');
var dbClient = require('mongodb').MongoClient;
var events = require('events');
var eventEmitter = new events.EventEmitter();
var UserCtrl = require(path.resolve('./app/controllers/user'));

function WatchMan(url, collectionName) {
    this.url = url;
    this.collection = collectionName;
    this.init(this.url, this.collection);
}

WatchMan.prototype = {
    /**
     * Connect To mongodb using MongoClient
     * @param url
     * @param collectionName
     */
    init: function (url, collectionName) {
        var self = this;
        dbClient.connect(url)
            .then(function (db) {
                self.watch(db, collectionName);
            })
            .catch(function () {
            });
    },
    /**
     * Watch 'system.profile' collection for any database changes
     * @param db
     * @param collectionName
     */
    watch: function (db, collectionName) {
        //create stream on system system.profile collection
        var stream = db.collection(collectionName)
            .find({
                    $or: [
                        {op: "insert"},
                        {op: "remove"},
                        {op: "update"}
                    ]
                },
                {
                    tailable: true
                })
            .stream();
        this.streamHandler(stream);
    },
    /**
     * Stream handler
     * @param stream
     */
    streamHandler: function (stream) {
        stream.on('data', function (doc) {
            var operation = doc.op;
            //Emit the operation event
            eventEmitter.emit(operation, doc);
        });
        stream.on('error', function (error) {
            eventEmitter.emit('error', error);
            console.log("error");
            console.error(error);
        });
    },
    /**
     * Event listener emited from stream handler
     * @param io
     */
    listener: function (io) {

        eventEmitter.on('insert', function (document) {

            UserCtrl.notifyUsers(document, io);
        });
        eventEmitter.on('update', function (document) {
            UserCtrl.notifyUsers(document, io);
        });
        eventEmitter.on('remove', function (document) {
            UserCtrl.notifyUsers(document, io);
        })
    }


};

module.exports = WatchMan;