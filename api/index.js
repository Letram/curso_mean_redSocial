//use of the new JavaScript standards such as lambda functions and so on.
'use strict'

//connection to a mongoDB database via mongoose module
var mongoose = require('mongoose');
//we are connectiong to the database using promises.
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean_red_social')
		//if we connect to our db properly, show it on the console.
		.then(()=>console.log("Conexión a DB OK. nodemon instalado."))
		//if not, show the error.
		.catch(err => console.log(err));
