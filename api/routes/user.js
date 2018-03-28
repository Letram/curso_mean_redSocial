'use strict'

var express = require('express');
var userController = require('../controllers/user');
var md_auth = require('../middlewares/authenticate');

var api = express.Router();

api.get('/home', userController.home);
api.get('/pruebas', md_auth.ensureAuth, userController.pruebas);
api.post('/register', userController.saveUser);
api.post('/login', userController.userLogin);
api.get('/user/:id', md_auth.ensureAuth, userController.getUser);
api.get('/users/:page?', md_auth.ensureAuth, userController.getUsers);
api.put('/update-user/:id', md_auth.ensureAuth, userController.updateUser);
module.exports = api;