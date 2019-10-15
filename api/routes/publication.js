'use strict';
var express = require("express");
var PublicationController = require("../controllers/publication");
var api = express.Router({});
var md_auth = require('../middlewares/authenticate');

var multipart = require("connect-multiparty");
var md_upload = multipart({uploadDir: "../uploads/publications"});

api.post("/publication", md_auth.ensureAuth, PublicationController.createPublication);
api.get("/publications/:page?", md_auth.ensureAuth, PublicationController.getAllFollowedPublications);
api.get("/publication/:id", md_auth.ensureAuth, PublicationController.getPublication);
api.delete("/publication/:id", md_auth.ensureAuth, PublicationController.deletePublication);
api.post("/upload-image-pub/:id", [md_auth.ensureAuth, md_upload], PublicationController.uploadImage);
api.get('/get-image-pub/:image_file', PublicationController.getImageFile);

module.exports = api;