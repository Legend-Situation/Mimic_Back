const express = require('express');
const router = express.Router();

const userRouter = require('./Users');
router.use('/auth', userRouter);

const jwtRouter = require('./Jwt');
router.use('/jwt', jwtRouter);

module.exports = router;
