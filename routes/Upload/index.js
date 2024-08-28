const express = require('express');
const router = express.Router();
const { validateToken } = require('../../middlewares/AuthMiddleware');
const { imgUpload, chatUpload } = require('./Upload');
const request = require('request');
const fs = require('fs');
const GptBody = require('./GptBody.json')

router.post('/image', validateToken, imgUpload.single('img'), (req, res) => {
	const IMG_URL = `${process.env.SERVER_ORIGIN}/image/${req.file.filename}`;
	res.json({ url: IMG_URL });
});

router.post('/chat', validateToken, chatUpload.single('file'), (req, res) => {
	const filePath = req.file.path;
	const FILE_URL = `${process.env.SERVER_ORIGIN}/chat/${req.file.filename}`;

	// 파일에서 텍스트 추출
	fs.readFile(filePath, 'utf8', (err, data) => {
		if (err) {
			console.error(err);
			return res.status(500).send('Failed to read txt');
		}

		// GPTBody 업데이트
		const updatedGptBody = {
			...GptBody,
			messages: [
				...GptBody.messages, // 기존 메시지를 유지
				{   // 새로운 사용자 메시지 추가
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
				return res.status(500).send('Failed to send GPT request');
			}

			const contents = body.choices.map(choice => {
				return JSON.parse(choice.message.content);
			});
			res.json({ FileURL: FILE_URL, Contents: contents });
		});
	});
});


module.exports = router;
