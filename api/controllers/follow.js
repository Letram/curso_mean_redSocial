'use strict'

var mongoosePaginate = require("mongoose-pagination");

var User = require('../models/user');
var Follow = require('../models/follow');

function prueba(req, res){
	res.status(200).send({message:"Todo va bien desde follow controller"});
}

module.exports = {
	prueba
}