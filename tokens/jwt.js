const jwt = require('jsonwebtoken');
require('dotenv').config();

const secret = process.env.SECRET_KEY;
const AccessExpired = process.env.ACCESS_EXPIRED;
const RefreshExpired = process.env.REFRESH_EXPIRED;

const generateAccessToken = userid => {
	const accessToken = jwt.sign(
		{
			userid,
		},
		secret,
		{
			expiresIn: AccessExpired,
		}
	);
	return accessToken;
};

const generateRefreshToken = userid => {
	const refreshToken = jwt.sign(
		{
			userid,
		},
		secret,
		{
			expiresIn: RefreshExpired,
		}
	);
	return refreshToken;
};

module.exports = { generateAccessToken, generateRefreshToken };
