const express = require('express');
const router = express.Router();

const SignUp = require('./SignUp.js');
router.post('/signup', SignUp);

const SignIn = require('./SignIn.js');
router.post('/signin', SignIn);

module.exports = router;
