'use strict';
var path=require('path');

var UserCtrl = require(path.resolve('./app/controllers/user'));
var SubscribeCtrl = require(path.resolve('./app/controllers/subscribe'));

module.exports = function(app) {
	app.post('/api/users/login', UserCtrl.login);
  	
  	app.get('/api/users', UserCtrl.getAllUsers);

	app.post('/api/users', UserCtrl.signup);
	
	app.get('/api/users/:id', UserCtrl.getUserById);
	
	app.post('/api/collections/subscribe',  SubscribeCtrl.subscribe);

	app.post('/api/collections/unsubscribe', SubscribeCtrl.unSubscribe);
};