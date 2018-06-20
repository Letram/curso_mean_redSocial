'use strict'
var express = require("express");
var FollowController = require("../controllers/follow");
var api = express.Router();
var md_auth = require('../middlewares/authenticate');

api.get('/prueba-follow', md_auth.ensureAuth, FollowController.prueba);

module.exports = api;