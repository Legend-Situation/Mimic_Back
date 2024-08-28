const express = require('express');
const router = express.Router();

const userRouter = require('./User');
router.use('/auth', userRouter);

module.exports = router;
