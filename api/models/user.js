//creating model USER via mongoose since we are using mongoDB.

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//model structure (schema)
var userSchema = Schema({
	name: String,
	surname: String,
	nick: String,
	email: String,
	password: String,
	role: String,
	image: String
});

//mongoose pluralize the model so 'User' is converted to 'users' and creates that collection in our db
module.exports = mongoose.model('User', userSchema);