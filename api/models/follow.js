//creating model FOLLOW via mongoose since we are using mongoDB.

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//model structure (schema)

//user and followed property is type of objectId as it is pointing to the Id of the user that is following someone and followed is the user id of the user we are following.
var followSchema = Schema({
	user: {type: Schema.ObjectId, ref: 'User'},
	followed: {type: Schema.ObjectId, ref: 'User'}
});

//mongoose pluralize the model so 'Follow' is converted to 'follows' and creates that collection in our db
module.exports = mongoose.model('Follow', followSchema);