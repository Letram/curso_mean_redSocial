'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//routes loader
var userRoutes = require('./routes/user');
var followRoutes = require('./routes/follow');
//middlewares

//required for body-parser. everytime we receive ant petition it is converted to a JSON object
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors

//routes

//now the url will be "/api" + userRoutes
app.use("/api", userRoutes);
app.use("/api", followRoutes);

//exports
module.exports = app;