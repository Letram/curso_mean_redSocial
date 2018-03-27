'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secretPass = 'secretPass';

//we receive a request, emit a response and next is what is going to let us get out of the middleware
exports.ensureAuth = function(request, response, next){
	if(!request.headers.authorization){
		return response.status(403).send({message: "La petición no tiene la cabecera de autenticación."});
	}
	//we have to remove any '' or "" in our token to decode it properly
	var token = request.headers.authorization.replace(/['"]+/g, '');

	try{
		var payload = jwt.decode(token, secretPass);
		console.log(payload);
		if(payload.exp <= moment().unix()){
			return response.status(401).send({message: "El token ha expirado"});
		};
	} catch(exception){
		console.log(exception);
		return response.status(404).send({message: "El token no es válido"});
	}

	//we add the user data to the request so we can have it anywhere in our controller
	request.user = payload;
	next();
}