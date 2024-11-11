const express = require('express');
const router = express.Router();
const { validateToken } = require('../../middlewares/AuthMiddleware');
const { imgUpload, chatUpload } = require('./Upload');
const fs = require('fs');
const GptBody = require('./GptBody.json');
const authUtil = require('../../response/authUtil.js');
const { Parsing } = require('../../Function/dataParsing.js')

router.post('/image', validateToken, imgUpload.single('img'), (req, res) => {
	const IMG_URL = `${process.env.SERVER_ORIGIN}/image/${req.file.filename}`;
	res
		.status(200)
		.send(authUtil.successTrue(200, '이미지 업로드가 완료되었습니다.', { url: IMG_URL }));
});

router.post('/chat', validateToken, chatUpload.single('file'), (req, res) => {
	const filePath = req.file.path;
	const FILE_URL = `${process.env.SERVER_ORIGIN}/chat/${req.file.filename}`;

	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.send(authUtil.successTrue(500, '텍스트파일을 읽을 수 없습니다.', { error: err }));
		}

		const lines = data.split('\n').slice(1);
		const cleanedData = lines.map(line => {
			const columns = line.split(',');
			return columns.slice(1).join(','); 
		}).join('\n');

		const truncatedData = cleanedData.substring(0, 1500);

		fs.writeFile(filePath.replace('.csv', '.txt'), truncatedData, 'utf8', (err) => {
			if (err) {
				console.error(err);
				return res
					.status(500)
					.send(authUtil.successTrue(500, '파일을 저장하는 데 오류가 발생했습니다.', { error: err }));
			}

			res
				.status(200)
				.send(authUtil.successTrue(200, '파일업로드에 성공했습니다.', { FileURL: FILE_URL }));
		});
	});
});

module.exports = router;
