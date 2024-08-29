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

module.exports = router;