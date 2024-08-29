const { verify } = require('jsonwebtoken');
const { Users } = require('../models');
const authUtil = require('../response/authUtil');

const secret = process.env.SECRET_KEY;
const validateToken = async (req, res, next) => {
	const accessToken = req.header('accessToken');

	if (!accessToken) {
		return res
			.status(403)
			.send(authUtil.successFalse(403, '엑세스 토큰이 존재하지 않습니다.'));
	}

	try {
		const decoded = verify(accessToken, secret);
		const userId = decoded.userid;
		const user = await Users.findOne({
			where: {
				userId,
			},
		});

		if (!user) {
			return res.status(200).send(authUtil.successFalse(200, '존재하지 않는 유저입니다.'));
		} else {
			req.user = user;
			return next();
		}
	} catch (err) {
		if (err.name === 'TokenExpiredError') {
			return res.status(403).json(authUtil.successTrue(403, '토큰이 만료되었습니다.'));
		}

		return res.status(403).json(authUtil.successFalse(403, '유효하지 않은 토큰입니다.'));
	}
};

module.exports = { validateToken };
