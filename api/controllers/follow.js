'use strict'

var mongoosePaginate = require("mongoose-pagination");

var User = require('../models/user');
var Follow = require('../models/follow');

function saveFollow(req, res){
	var params = req.body;
	console.log(params);
	var follow = new Follow();
	follow.user = req.user.sub;
	follow.followed = params.followed;

	follow.save((error, followStored) => {
	    if(error)return res.status(500).send({message: "Error al mandar el seguimiento..."});
	    if(!followStored) return res.status(404).send({message: "El seguimiento no se ha guardado..."});
	    return res.status(200).send({follow: followStored});
    })
}

module.exports = {
	saveFollow
};