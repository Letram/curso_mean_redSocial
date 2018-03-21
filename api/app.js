'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//routes loader

//middlewares

//required for body-parser. everytime we receive ant petition it is converted to a JSON object
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cors

//routes

//HTTP GET

app.get("/", (request, response) =>{
	response.status(200).send({
		message: "Hello World!"
	});
});
app.get("/pruebas", (request, response) =>{
	response.status(200).send({
		message: "testing in nodeJS server"
	});
});
//exports
module.exports = app;