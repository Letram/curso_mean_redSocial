"use strict";

var moment = require("moment");
var mongoosePaginate = require("mongoose-pagination");

var Message = require("../models/message");
var User = require("../models/user");
var Follow = require("../models/follow");

function createMessage(req, res){
    var params = req.body;
    if(!params.text || !params.receiver){
        return res.status(200).send({message: "rellena los campos necesarios"});
    }
    var message = new Message();
    message.emmiter = req.user.sub;
    message.receiver = params.receiver;
    message.text = params.text;
    message.created_at = moment().unix();
    message.viewed = false;

    message.save((err, messageSaved) => {
        if(err)return res.status(500).send({message: "Error en la peticion para enviar el mensaje"});
        if(!messageSaved) return res.status(500).send({message: "Error al enviar el mensaje"});
        return res.status(200).send({message: messageSaved});
    });
}

function getReceivedMessages(req, res){
    var userId = req.user.sub;
    var page = 1;
    if(req.params.page) page = req.params.page;
    var itemsPerPage = 5;

    Message.find({"receiver": userId}).populate("emmiter receiver", "name surname nick image _id").paginate(page, itemsPerPage, (err, messages, totalMessages) => {
        if(err)return res.status(500).send({message: "Error en la peticion para leer todos los mensajes"});
        if(!messages) return res.status(404).send({message: "No hay mensajes disponibles"});
        return res.status(200).send({totalMessages, pages: Math.ceil(totalMessages/itemsPerPage), messages});
    });
}

function getSentMessages(req, res){
    var userId = req.user.sub;
    var page = 1;
    if(req.params.page) page = req.params.page;
    var itemsPerPage = 5;

    Message.find({"emmiter": userId}).populate("emmiter receiver", "name surname nick image _id").paginate(page, itemsPerPage, (err, messages, totalMessages) => {
        if(err)return res.status(500).send({message: "Error en la peticion para leer todos los mensajes"});
        if(!messages) return res.status(404).send({message: "No hay mensajes disponibles"});
        return res.status(200).send({totalMessages, pages: Math.ceil(totalMessages/itemsPerPage), messages});
    });
}

function getUnseenMessagesCounter(req,res){
    var userId = req.user.sub;

    Message.count({receiver: userId, viewed:false}).exec((err, count)=>{
        if(err)return res.status(500).send({message: "Error en la peticion para contar los mensajes no leidos"});
        return res.status(200).send({"unviewed": count});

    });
}

function markMessageAsSeen(req, res){
    var userId = req.user.sub;
    Message.update({receiver: userId, viewed:false}, {viewed:true}, {"multi":true}, (err, messageUpdate) => {
        if(err)return res.status(500).send({message: "Error en la peticion para marcar el mensaje como leido"});
        return res.status(200).send({messages: messageUpdate});
    });
}
module.exports = {
    createMessage,
    getReceivedMessages,
    getSentMessages,
    getUnseenMessagesCounter,
    markMessageAsSeen
};