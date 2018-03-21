//creating model PUBLICATION via mongoose since we are using mongoDB.

'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//model structure (schema)

//user property is type of objectId as it is pointing to the Id of the user that creates a publication. (foreign key)
var publicationSchema = Schema({
	text: String,
	file: String,
	created_at: String,
	user: {type: Schema.ObjectId, ref: 'User'}
});

//mongoose pluralize the model so 'Publication' is converted to 'publications' and creates that collection in our db
module.exports = mongoose.model('Publication', publicationSchema);