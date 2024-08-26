const dotenv = require('dotenv');
dotenv.config();

module.exports = {
	development: {
		username: process.env.DB_ID,
		password: process.env.DB_PW,
		database: 'Mimic',
		host: process.env.DB_POST,
		port: process.env.DB_PORT,
		dialect: 'mysql',
		timezone: '+09:00',
	},
	test: {
		username: process.env.DB_ID,
		password: process.env.DB_PW,
		database: 'Mimic',
		host: process.env.DB_POST,
		port: process.env.DB_PORT,
		dialect: 'mysql',
		timezone: '+09:00',
	},
	production: {
		username: process.env.DB_ID,
		password: process.env.DB_PW,
		database: 'Mimic',
		host: process.env.DB_POST,
		port: process.env.DB_PORT,
		dialect: 'mysql',
		timezone: '+09:00',
	},
};
