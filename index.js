const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config();

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname + '/public')));

//Port Setting
const PORT = process.env.PORT;

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
	app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
