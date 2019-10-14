//use of the new JavaScript standards such as lambda functions and so on.
'use strict';

//connection to a mongoDB database via mongoose module
var mongoose = require('mongoose');
var app = require("./app");
//port wich the server will be listening to.
var port = 3800;

//we are connecting to the database using promises.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_social')
		//if we connect to our db properly, show it on the console.
		.then(() => {
			console.log("Conexión a DB OK.");
			app.listen(port, () => {
				console.log("Servidor corriendo en http://localhost:3800");
			});
		})
		//if not, show the error.
		.catch(err => console.log(err));
