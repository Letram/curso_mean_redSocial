'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretPass = 'secretPass'
exports.createToken = function(user){
	//we have to create a payload with all the data we want to hash into our token
	//iat = token creation date
	//exp = token expiration date
	var payload = {
		sub: user._id,
		name: user.name,
		surname: user.surname,
		email: user.email,
		nick: user.nick,
		role: user.role,
		image: user.image,
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix()
	};
	//in order to create a token we have to cypher the payload. we use jwt encode method to encrypt the payload with our secretPass
	return jwt.encode(payload, secretPass)
};