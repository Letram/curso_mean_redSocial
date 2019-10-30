'use strict';
var express = require("express");
var MessageController = require("../controllers/message");
var api = express.Router({});
var md_auth = require('../middlewares/authenticate');

api.post("/message", md_auth.ensureAuth, MessageController.createMessage);
api.get("/my-messages/:page?", md_auth.ensureAuth, MessageController.getReceivedMessages);
api.get("/messages/:page?", md_auth.ensureAuth, MessageController.getSentMessages);
api.get("/unviewed-messages", md_auth.ensureAuth, MessageController.getUnseenMessagesCounter);
api.get("/view-messages", md_auth.ensureAuth, MessageController.markMessageAsSeen);

module.exports = api;
