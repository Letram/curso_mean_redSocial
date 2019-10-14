'use strict';

var path = require("path");
var fs = require("fs");
var moment = require("moment");
var mongoosePaginate = require("mongoose-pagination");

var Publication = require("../../../curso_mean_redSocial-master/api/models/publication");
var User = require("../../../curso_mean_redSocial-master/api/models/user");
var Follow = require("../../../curso_mean_redSocial-master/api/models/follow");

function createPublication(req, res){
    var params = req.body;
    if(!params.text)return res.status(200).send({message: "El cuerpo texto no puede estar vacio."});

    var publication = new Publication();
    publication.text = params.text;
    publication.file = "null";
    publication.user = req.user.sub;
    publication.created_at = moment().unix();

    publication.save((err, publicationStored) => {
        if(err)return res.status(500).send({message: "Error al guardar la publicacion"});
        if(!publicationStored) return res.status(404).send({message: "La publicacion no ha sido guardada"});
        return res.status(200).send({publication: publicationStored});
    });
}

function getAllFollowedPublications(req, res){
    var page = 1;
    if(req.params.page)page = req.params.page;
    var itemsPerPage = 5;
    Follow.find({user: req.user.sub}).populate("followed").exec((err, follows) => {
        if(err)return res.status(500).send({message: "Error al devolver el seguimiento"});

        var follows_clean = [];

        follows.forEach((follow) => {
            follows_clean.push(follow.followed);
        });

        //busco usuarios cuyo id esté contenido en follows clean
        Publication.find({user: {"$in": follows_clean}}).sort("-created_at").populate("user").paginate(page, itemsPerPage, (err, publications, total) => {
            if(err)return res.status(500).send({message: "Error al devolver las publicaciones"});
            if(!publications) res.status(404).send({message: "No hay publicaciones"});

            return res.status(200).send({total_items: total, publications, pages:Math.ceil(total/itemsPerPage), page});
        });
    })
}

function getPublication(req, res){
    var pubId = req.params.id;

    Publication.findById(pubId, (err, publication) => {
        if(err)return res.status(500).send({message: "Error al devolver la publicacion"});
        if(!publication) res.status(404).send({message: "No existe la publicacion"});
        return res.status(200).send({publication});
    });
}

function deletePublication(req, res){
    var pubId = req.params.id;

    Publication.find({user: req.user.sub, "_id": pubId}).remove(err => {
        if(err)return res.status(500).send({message: "Error al borrar la publicacion"});
        return res.status(200).send({message: "Publicacion eliminada con éxito"});
    });
}

function uploadImage(req, res){
    var pubId = req.params.id;

    if(req.files){
        var supportedExt = ['png', 'jpg', 'jpeg', 'gif'];
        var filePath = req.files.image.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[fileSplit.length -1];
        var extSplit = fileName.split('\.');
        var fileExt = extSplit[1];

        if(supportedExt.includes(fileExt)){

            Publication.findOne({"user": req.user.sub, "_id": pubId}).exec((err, publication) => {
               if(publication){
                   Publication.findByIdAndUpdate(pubId, {file: fileName}, {new:true}, (err, publicationUpdated) => {
                       if(err)return res.status(500).send({message: "Error en la petición."});

                       if(!publicationUpdated)return res.status(404).send({message: "No se ha podido actualizar la publicacion"});

                       return res.status(200).send({publication: publicationUpdated});
                   });
               }else{
                   return removeFileFromUploads(res, filePath, "No tienes permiso para actualizar la publicacion.")
               }
            });
        }else{
            return removeFileFromUploads(res, filePath, "Extensión no soportada.")
        }

    }else{
        return res.status(200).send({message: "No se ha subido ninguna imagen."});
    }
}

function removeFileFromUploads(res, filePath, message){
    fs.unlink(filePath, (err) =>{
        if(err)res.status(200).send({message: message});
    });
}

function getImageFile(req, res){
    var image_file = req.params.image_file;
    var file_path = './uploads/publications' + image_file;

    fs.exists(file_path, (exists) => {
        if(exists)res.sendFile(path.resolve(file_path));
        else res.status(200).send({message:"No existe la imagen."});
    });
}


module.exports = {
    createPublication,
    getAllFollowedPublications,
    getPublication,
    deletePublication,
    uploadImage,
    getImageFile
};