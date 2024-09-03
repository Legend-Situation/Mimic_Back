const express = require('express');
const router = express.Router();

const { validateToken } = require('../../middlewares/AuthMiddleware.js');

const CreateUser = require('./CreateUser.js')
router.post('/', validateToken, CreateUser)

const GetChatList = require('./GetChatList_All.js')
router.get('/', validateToken, GetChatList)

const Chatting = require('./Chatting.js')
router.post('/chatting/:id', validateToken, Chatting)

const ChattingLog = require('./GetChatLog.js')
router.get('/chatting/:id', validateToken, ChattingLog)

const DelteChat = require('./DeleteChat.js')
router.delete('/chatting/:id', validateToken, DelteChat)

const UpdateChatUser = require('./UpdateChatUser.js')
router.put('/chatting/:id', validateToken, UpdateChatUser)

module.exports = router;