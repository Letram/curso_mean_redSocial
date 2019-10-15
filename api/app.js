'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//routes loader
var userRoutes = require('./routes/user');
var followRoutes = require('./routes/follow');
var publicationRoutes = require("./routes/publication");
var messageRoutes = require("./routes/message");
//middlewares

//required for body-parser. everytime we receive ant petition it is converted to a JSON object
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');

    next();
});

//routes

//now the url will be "/api" + userRoutes
app.use("/api", userRoutes);
app.use("/api", followRoutes);
app.use("/api", publicationRoutes);
app.use("/api", messageRoutes);
//exports
module.exports = app;