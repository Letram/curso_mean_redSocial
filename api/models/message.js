//creating model MESSAGE via mongoose since we are using mongoDB.

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//model structure (schema)

//emmiter and receiver are both objectId because they are pointing to the user that emitted the message and to the user wich will receive the message
var messageSchema = Schema({
	text: String,
	created_at:String,
	emmiter: {type: Schema.ObjectId, ref:'User'},
	receiver: {type: Schema.ObjectId, ref:'User'}
});

//mongoose pluralize the model so 'Message' is converted to 'messages' and creates that collection in our db
module.exports = mongoose.model('Message', messageSchema);