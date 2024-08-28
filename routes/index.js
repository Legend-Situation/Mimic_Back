const express = require('express');
const router = express.Router();

// 사용자 인증 라우터
const userRouter = require('./Users');
router.use('/auth', userRouter);

// JWT 인증 라우터
const jwtRouter = require('./Jwt');
router.use('/jwt', jwtRouter);

// 파일 업로드 라우터
const uploadRouter = require('./Upload');
router.use('/upload', uploadRouter);

module.exports = router;
