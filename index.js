const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const requestIp = require("request-ip");
const logger = require('./logger.js')
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));

// Server Logs
app.use((req, res, next) => {
	const ipAddress = requestIp.getClientIp(req);
	const requestPath = req.path;
	logger.info(`Request received`, { ip: ipAddress, path: requestPath });
	next();
});

//Port Setting
const PORT = process.env.PORT || 3000;

//API Test
app.get('/', (req, res) => {
	res.send('API Running');
});

//DataBase
const db = require('./models');

//DataBase Router Call
const ApiRouter = require('./routes');
app.use('/', ApiRouter);

//Port
db.sequelize.sync().then(() => {
	app.listen(PORT, () => {
		logger.info(`Sever Started on Port ${process.env.PORT}`)
	});
});
