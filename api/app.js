'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//routes loader
var userRoutes = require('./routes/user');
var followRoutes = require('./routes/follow');
var publicationRoutes = require("./routes/publication");
//middlewares

//required for body-parser. everytime we receive ant petition it is converted to a JSON object
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors

//routes

//now the url will be "/api" + userRoutes
app.use("/api", userRoutes);
app.use("/api", followRoutes);
app.use("/api", publicationRoutes);
//exports
module.exports = app;