'use strict'

var bcrypt = require('bcrypt-nodejs');
//capitalizaed so we know it is a model
var User = require('../models/user');

function home(request, response){
	response.status(200).send({
		message: "Hello World!"
	});
}

function pruebas(request, response){
	console.log(request.body);
	response.status(200).send({
		message: "testing in nodeJS server"
	});
}

function saveUser(request, response){
	var params = request.body;
	var user = new User();

	if(params.name && params.surname && params.nick && params.email && params.password){
		user.name = params.name;
		user.surname = params.surname;
		user.nick = params.nick;
		user.email = params.email;

		user.role = 'ROLE_USER';
		user.image = null;

		bcrypt.hash(params.password, null, null, function (error, passwordHashed){
			user.password = passwordHashed;

			user.save(function(error, userStored){
				if(error)
					return response.status(500).send({
						message:"Error al guardar el usuario"
					});
				if(userStored){
					return response.status(200).send({
						user:userStored
					});
				}else{
					return response.status(404).send({
						message:"No se ha registrado el usuario."
					});
				}
			});
		});

	}else{
		//if any of the params are missing we have to tell them they have to do it right
		response.status(200).send({
			message:"Rellena todos los datos necesarios para registrar el usuario."
		});
	}
}
//we are exporting "home" and "pruebas" functions so we can use them from other classes if we import this.
module.exports = {
	home,
	pruebas,
	saveUser
}