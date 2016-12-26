'use strict';

var db = require('./config');
var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
mongoose.connect(db.getConnectionString('dev'));

var WatchMan = require('./app/lib/index');
var watchman = new WatchMan(db.getConnectionString('dev'), db.tailabeCollection);

var port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.use(function (req, res, next) {
    res.io = io;
    next();
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/collections', function (req, res) {
    mongoose.connection.db.listCollections().toArray(function (error, result) {
        if (error)
            response.json({status: "error", message: "Internal Server Error"});
        res.json({status: "success", message: result})
    });
});

require('./app/routes/user')(app);
require('./app/controllers/socketHandler')(io, watchman);

http.listen(port);

console.log('listining on Port => ', port);

exports = module.exports = app;