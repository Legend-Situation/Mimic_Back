const express = require('express');
const router = express.Router();
const { validateToken } = require('../../middlewares/AuthMiddleware');
const { imgUpload, chatUpload } = require('./Upload');
const request = require('request');
const fs = require('fs');
const GptBody = require('./GptBody.json')
const authUtil = require('../../response/authUtil.js');

router.post('/image', validateToken, imgUpload.single('img'), (req, res) => {
	const IMG_URL = `${process.env.SERVER_ORIGIN}/image/${req.file.filename}`;
	res
		.status(200)
		.send(authUtil.successTrue(200, '이미지 업로드가 완료되었습니다.', { url: IMG_URL }));
});

router.post('/chat', validateToken, chatUpload.single('file'), (req, res) => {
	const filePath = req.file.path;
	const FILE_URL = `${process.env.SERVER_ORIGIN}/chat/${req.file.filename}`;

	// 파일에서 텍스트 추출
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res
				.status(500)
				.send(authUtil.successTrue(500, '텍스트파일을 읽을 수 없습니다.', { error: err }));
		}

		// GPTBody 업데이트
		const updatedGptBody = {
			...GptBody,
			messages: [
				...GptBody.messages,
				{  
					"role": "user",
					"content": [
						{
							"type": "text",
							"text": data
						}
					]
				}
			]
		};

		// GPT API 요청
		const options = {
			uri: 'https://api.openai.com/v1/chat/completions',
			method: 'POST',
			body: updatedGptBody,
			json: true,
			headers: {
				'Authorization': `Bearer ${process.env.GPT_SECRET_KEY}`,
				'Content-Type': 'application/json'
			},
		};

		request.post(options, function (err, httpResponse, body) {
			if (err) {
				console.error(err);
				res
					.status(500)
					.send(authUtil.successFalse(500, 'GPT에 요청을 보낼 수 없습니다.'));
			}

			const contents = body.choices.map(choice => {
				return JSON.parse(choice.message.content);
			});
			res
				.status(200)
				.send(authUtil.successTrue(200, '파일업로드에 성공했습니다.', { FileURL: FILE_URL, Contents: contents }));
		});
	});
});


module.exports = router;
