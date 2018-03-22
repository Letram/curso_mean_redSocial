'use strict'

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

//we are exporting "home" and "pruebas" functions so we can use them from other classes if we import this.
module.exports = {
	home,
	pruebas
}