'use strict'

var bcrypt = require('bcrypt-nodejs');
//capitalizaed so we know it is a model
var User = require('../models/user');
var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
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

//we have to make sure not to save a new user with and already saved email or nick.
//duplicated users control
		User.find({ $or: [
				{email: user.email.toLowerCase()},
				{nick: user.nick}
				]}).exec((error, users)=>{
					if(error)return response.status(500).send({message:"Error al guardar el usuario"});
					
					if(users && users.length > 0){
						return response.status(200).send({message: "Email o usuario ya existente."});
					}else{
//if the user is not duplicated, we cypher its pass and save it into the db
						bcrypt.hash(params.password, null, null, (error, passwordHashed) => {
							user.password = passwordHashed;

							user.save((error, userStored) => {
								if(error)
									response.status(500).send({message:"Error al guardar el usuario"});
								
								if(userStored){
									response.status(200).send({user: userStored});
								}else{
									response.status(404).send({message:"No se ha registrado el usuario."});
								}
							});
						});
					}
				});
	}else{
		//if any of the params are missing we have to tell them they have to do it right
		response.status(200).send({
			message:"Rellena todos los datos necesarios para registrar el usuario."
		});
	}
}

function userLogin(request, response){
	var params = request.body;

	var userEmail = params.email;
	var userPassword = params.password;

	User.findOne({email: userEmail}, (error, user) =>{
		if(error)
			return response.status(500).send({message:"Error en la petición."});
		if(user)
			bcrypt.compare(userPassword, user.password, (error, check) => {
				if(check){
					//if we want to receive our user params as a token we have to make the getToken variable true when sending the request
					if(params.getToken){
						return response.status(200).send({token: jwt.createToken(user)});
					}else{
						user.password = undefined;
						return response.status(200).send({user});
					}
				}
				else
					return response.status(404).send({message:"El usuario no se ha podido identificar. ERROR EN EL COMPARE"});
			});
		else
			return response.status(404).send({message:"El usuario no se ha podido identificar. ERROR EN EL FIND_ONE"});
	});
}

function getUser(request, response){
	//user id comes via url
	var userID = request.params.id;

	User.findById(userID, (error, user) =>{
		if(error)return response.status(500).send({
			message: "Error en la petición."
		});
		if(!user) return response.status(404).send({
			message: "El usuario no existe."
		});
		return response.status(200).send(user);
	})
}

function getUsers(req, res){
	//id of the current logged user
	var identity_userID = req.user.sub;
	var page = 1;
	if(req.params.page){
		page = req.params.page;
	}
	var itemsPerPage = 5;

	User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
		if(err)return response.status(500).send({
			message: "Error en la petición."
		});
		if(!users)return response.status(404).send({
			message: "No hay usuarios disponibles."
		});
		return res.status(200).send({
			users,
			total,
			pages: Math.ceil(total/itemsPerPage)
		});
	});
}

//update function to change any parameter of our user logged in. The password will NOT be allowed to change using this function.
function updateUser(req, res){
	var userId = req.params.id;
	var update = req.body;

	delete update.password;

	if(userId != req.user.sub) return res.status(500).send({message: "No tienes permiso para hacer esta acción."});

	User.findByIdAndUpdate(userId, update, {new:true}, (err, updatedUSer) => {
		if(err)return res.status(500).send({
			message: "Error en la petición."
		});
		if(!updatedUSer)return res.status(404).send({
			message: "No se ha podido actualizar el usuario"
		});
		return res.status(200).send({updatedUSer});
	});
}
//we are exporting "home" and "pruebas" functions so we can use them from other classes if we import this.
module.exports = {
	home,
	pruebas,
	saveUser,
	userLogin,
	getUser,
	getUsers,
	updateUser
}