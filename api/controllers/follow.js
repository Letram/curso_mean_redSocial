'use strict'

var mongoosePaginate = require("mongoose-pagination");

var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res){
	var params = req.body;
	var follow = new Follow();
	follow.user = req.user.sub;
	follow.followed = params.followed;

	follow.save((error, followStored) => {
	    if(error)return res.status(500).send({message: "Error al mandar el seguimiento..."});
	    if(!followStored) return res.status(404).send({message: "El seguimiento no se ha guardado..."});
	    return res.status(200).send({follow: followStored});
    })
}

function deleteFollow(req, res){
    var userId = req.user.sub;
    var followed = req.params.id;

    Follow.find({"user": userId, "followed": followed}).remove((err) => {
        if(err)return res.status(500).send({message: "Error al dejar de seguir al usuario..."});
        return res.status(200).send({message: "Seguimiento eliminado correctamente..."})
    });
}

function getFollowingUsers(req, res) {
    var userId = req.user.sub;
    if (req.params.id && req.params.page) userId = req.params.id;

    var page = 1;
    if (req.params.page) page = req.params.page;
    else {
        page = req.params.id;
    }
    var itemsPerPage = 4;

    Follow.find({user: userId}).populate({path: "followed"}).paginate(page, itemsPerPage, (err, follows, total) => {
        if (err) return res.status(500).send({message: "Error al traer los usuarios que sigue..."});
        if (!follows) return res.status(404).send({message: "No has seguido a nadie!"});

        followUsersIds(userId).then(
            (value) => {
                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total / itemsPerPage),
                    follows,
                    users_following: value.following_clean,
                    users_follow_me: value.followed_clean
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
    return {following_clean, followed_clean};
}

function getFollowedUsers(req, res){
    var userId = req.user.sub;
    if(req.params.id && req.params.page)userId = req.params.id;

    var page = 1;
    if(req.params.page)page = req.params.page;
    else{
        page = req.params.id;
    }
    var itemsPerPage = 4;

    Follow.find({followed:userId}).populate("user").paginate(page, itemsPerPage, (err, follows, total) => {
        if(err)return res.status(500).send({message: "Error al traer los usuarios que sigue..."});
        if(!follows)return res.status(404).send({message: "No te sigue ningún usuario!"});
        followUsersIds(userId).then(
            (value) => {
                return res.status(200).send({
                    total: total,
                    pages: Math.ceil(total / itemsPerPage),
                    follows,
                    users_following: value.following_clean,
                    users_follow_me: value.followed_clean
                });
            });
    });
}

function getFollows(req, res){
    var userId = req.user.sub;

    var find = Follow.find({user:userId});
    if(req.params.followed){
        find=Follow.find({followed:userId});
    }
    find.populate("user followed").exec((err, follows) => {
        if(err)return res.status(500).send({message: "Error en el servidor..."});
        if(!follows)return res.status(404).send({message: "No hay usuarios disponibles!"});
        return res.status(200).send({follows});
    });
}


module.exports = {
	saveFollow,
    deleteFollow,
    getFollowingUsers,
    getFollowedUsers,
    getFollows
};
