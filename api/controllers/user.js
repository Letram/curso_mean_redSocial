'use strict';

var bcrypt = require('bcrypt-nodejs');
//capitalizaed so we know it is a model
var User = require('../models/user');
var Follow = require("../models/follow");
var Publication = require("../models/publication");

var jwt = require('../services/jwt');
var mongoosePaginate = require('mongoose-pagination');
var fs = require('fs');
var path = require('path');

function home(request, response) {
    response.status(200).send({
        message: "Hello World!"
    });
}

function pruebas(request, response) {
    response.status(200).send({
        message: "testing in nodeJS server"
    });
}

function saveUser(request, response) {
    var params = request.body;
    var user = new User();

    if (params.name && params.surname && params.nick && params.email && params.password) {
        user.name = params.name;
        user.surname = params.surname;
        user.nick = params.nick;
        user.email = params.email;

        user.role = 'ROLE_USER';
        user.image = null;

//we have to make sure not to save a new user with and already saved email or nick.
//duplicated users control
        User.find({
            $or: [
                {email: user.email.toLowerCase()},
                {nick: user.nick.toLowerCase()}
            ]
        }).exec((error, users) => {
            if (error) return response.status(500).send({message: "Error al guardar el usuario"});

            if (users && users.length > 0) {
                return response.status(200).send({message: "Email o usuario ya existente."});
            } else {
//if the user is not duplicated, we cypher its pass and save it into the db
                bcrypt.hash(params.password, null, null, (error, passwordHashed) => {
                    user.password = passwordHashed;

                    user.save((error, userStored) => {
                        if (error)
                            response.status(500).send({message: "Error al guardar el usuario"});

                        if (userStored) {
                            response.status(200).send({user: userStored});
                        } else {
                            response.status(404).send({message: "No se ha registrado el usuario."});
                        }
                    });
                });
            }
        });
    } else {
        //if any of the params are missing we have to tell them they have to do it right
        response.status(200).send({
            message: "Rellena todos los datos necesarios para registrar el usuario."
        });
    }
}

function userLogin(request, response) {
    var params = request.body;

    var userEmail = params.email;
    var userPassword = params.password;

    User.findOne({email: userEmail}, (error, user) => {
        if (error)
            return response.status(500).send({message: "Error en la petición."});
        if (user)
            bcrypt.compare(userPassword, user.password, (error, check) => {
                if (check) {
                    //if we want to receive our user params as a token we have to make the getToken variable true when sending the request
                    if (params.getToken) {
                        return response.status(200).send({token: jwt.createToken(user)});
                    } else {
                        user.password = undefined;
                        return response.status(200).send({user});
                    }
                } else
                    return response.status(404).send({message: "El usuario no se ha podido identificar. ERROR EN EL COMPARE"});
            });
        else
            return response.status(404).send({message: "El usuario no se ha podido identificar. ERROR EN EL FIND_ONE"});
    });
}

function getUser(request, response) {
    //user id comes via url
    var userID = request.params.id;

    User.findById(userID, (error, user) => {
        if (error) return response.status(500).send({
            message: "Error en la petición."
        });
        if (!user) return response.status(404).send({
            message: "El usuario no existe."
        });
        followThisUser(req.user.sub, userID).then((value) => {
            user.password = undefined;
            return res.status(200).send({user, "following": value.following, "followed": value.followed});
        });
    });
}

async function followThisUser(identity_user_id, user_id) {
    var following = await Follow.findOne({"user": identity_user_id, "followed": user_id}).exec((err, follow) => {
        if (err) return handleError(err);
        return follow;
    });
    var followed = await Follow.findOne({"user": user_id, "followed": identity_user_id}).exec((err, follow) => {
        if (err) return handleError(err);
        return follow;
    });
    return {following, followed};
}

function getUsers(req, res) {
    //id of the current logged user
    var identity_userID = req.user.sub;
    var page = 1;
    if (req.params.page) {
        page = req.params.page;
    }
    var itemsPerPage = 3;

    User.find().sort('_id').paginate(page, itemsPerPage, (err, users, total) => {
        if (err) return response.status(500).send({
            message: "Error en la petición."
        });
        if (!users) return response.status(404).send({
            message: "No hay usuarios disponibles."
        });

        followUsersIds(identity_userID).then((value) => {
            return res.status(200).send({
                users,
                users_following: value.following_clean,
                users_followed: value.followed_clean,
                total,
                pages: Math.ceil(total / itemsPerPage)
            });
        });
    });
}

async function followUsersIds(user_id) {

    //cuando hago el exec(), las cosas que se devuelven en el callback => (error, follows), por ejemplo, van en un pipe a: follows -> then((value)) y error -> catch((error))
    var following = await Follow.find({"user": user_id}).select({
        "_id": 0,
        "__v": 0,
        "user": 0
    }).exec().then((follow) => {return follow}).catch((err) => {return handleError(err)});

    //cuando hago el exec(), las cosas que se devuelven en el callback => (error, follows), por ejemplo, van en un pipe a: follows -> then((value)) y error -> catch((error))
    var followed = await Follow.find({"followed": user_id}).select({
        "_id": 0,
        "__v": 0,
        "followed": 0
    }).exec().then((follow) => {return follow}).catch((err) => {return handleError(err)});

//procesar following ids
    var following_clean = [];
    //if(following){
        following.forEach((follow) => {
            following_clean.push(follow.followed);
        });
    //}

//procesar followed ids
    var followed_clean = [];
    //if(followed){
        followed.forEach((follow) => {
            followed_clean.push(follow.user);
        });
    //}
    console.log({following_clean, followed_clean});

    return {following_clean, followed_clean};
}

function getCounters(req, res) {
    var userId = req.user.sub;

    if (req.params.id) userId = req.params.id;

    getCounterFollow(userId).then((value) => {
        return res.status(200).send(value);
    });
}

async function getCounterFollow(user_id) {
/*    var following = await Follow.count({"user": user_id}).exec((err, count) => {
        if (err) return handleError(err);
        return count;
    });

    var followed = await Follow.count({"followed": user_id}).exec((err, count) => {
        if (err) return handleError(err);
        return count;
    });

    var publications = await Publication.count({"user": user_id}).exec((err, count) => {
        if (err) handleError(err);
        return count;
    });*/
    var following = await Follow.count({"user": user_id}).exec().then((count) => {return count}).catch((err) => {handleError(err)});

    var followed = await Follow.count({"followed": user_id}).exec().then((count) => {return count}).catch((err) => {handleError(err)});

    var publications = await Publication.count({"user": user_id}).exec().then((count) => {return count}).catch((err) => {handleError(err)});

    return {following, followed, publications};
}

//update function to change any parameter of our user logged in. The password will NOT be allowed to change using this function.
function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    delete update.password;

    if (userId != req.user.sub) return res.status(500).send({message: "No tienes permiso para hacer esta acción."});

	function toLowerCase(nick) {
		return nick.toLowerCase();
	}

	User.find({
		$or: [
			{email: update.email.toLowerCase()},
			{nick: {'$regex': `^${update.nick}$`}}
		]
    }).exec((err, users) => {
    	var user_isset = false;
    	users.forEach((user) => {
    		console.log({user: user, currentId: userId});
    		console.log({user_id: user._id.toString(), current_id: userId, comparison: user._id.toString() === userId});
			if ( user && user._id.toString() !== userId){
				user_isset = true;
			}
		});
    	if(user_isset) return res.status(500).send({message: "Email o nick ya existentes."});
		User.findByIdAndUpdate(userId, update, {new: true}, (err, updatedUser) => {
			if (err) return res.status(500).send({
				message: "Error en la petición."
			});
			if (!updatedUser)
				return res.status(404).send({
					message: "No se ha podido actualizar el usuario"
				});
			updatedUser.password = undefined;
			return res.status(200).send({updatedUser});
		});
	});


}

function uploadImage(req, res) {
    var userId = req.params.id;

    if (req.files) {
        var supportedExt = ['png', 'jpg', 'jpeg', 'gif'];
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[fileSplit.length - 1];
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if (userId != req.user.sub) {
            return removeFileFromUploads(res, filePath, "No tienes permiso para hacer esta acción.")
        }

        if (supportedExt.includes(fileExt)) {
            User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, updatedUser) => {
                if (err) return res.status(500).send({
                    message: "Error en la petición."
                });
                if (!updatedUser) return res.status(404).send({
                    message: "No se ha podido actualizar el usuario"
                });
                return res.status(200).send({updatedUser});
            });
        } else {
            return removeFileFromUploads(res, filePath, "Extensión no soportada.")
        }

    } else {
        return res.status(200).send({message: "No se ha subido ninguna imagen."});
    }
}

function removeFileFromUploads(res, filePath, message) {
    fs.unlink(filePath, (err) => {
        if (err) res.status(200).send({message: message});
    });
}

function getImageFile(req, res) {
    var image_file = req.params.image_file;
    var file_path = './uploads/users/' + image_file;

    fs.exists(file_path, (exists) => {
        if (exists) res.sendFile(path.resolve(file_path));
        else res.status(200).send({message: "No existe la imagen."});
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
    getCounters,
    updateUser,
    uploadImage,
    getImageFile
};
