const express = require('express');
const router = express.Router();
const { validateToken } = require('../../middlewares/AuthMiddleware');
const { imgUpload, chatUpload } = require('./Upload');

router.post('/image', validateToken, imgUpload.single('img'), (req, res) => {
	const IMG_URL = `${process.env.SERVER_ORIGIN}/image/${req.file.filename}`;
	res.json({ url: IMG_URL });
});

router.post('/chat', validateToken, chatUpload.single('file'), (req, res) => {
	const FILE_URL = `${process.env.SERVER_ORIGIN}/chat/${req.file.filename}`;
	res.json({ url: FILE_URL });
});

module.exports = router;
