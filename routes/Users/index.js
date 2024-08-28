const express = require('express');
const router = express.Router();

const { validateToken } = require('../../middlewares/AuthMiddleware.js');

const LoginState = require('./LoginState.js');
router.get('/', validateToken, LoginState);

const SignUp = require('./SignUp.js');
router.post('/signup', SignUp);

const SignIn = require('./SignIn.js');
router.post('/signin', SignIn);

module.exports = router;
