const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const requestIp = require("request-ip");
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));

// Server Logs
app.use((req, res, next) => {
	const ipAddress = requestIp.getClientIp(req);
	const requestPath = req.path;
	console.log(`-------------------------------------------------------------`);
	console.log(`Request received from IP: ${ipAddress}, Path: ${requestPath}`);
	console.log(`-------------------------------------------------------------`);
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
	console.log(`-------------------------------------------------------------`);
	app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
