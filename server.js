require('dotenv').config();
const express = require('express');
const api_router = require('./routes/api');
var mongoose = require('mongoose');
const app = express();
const PORT = process.env.SERVER_PORT;
const path = require('path');
const filePath = path.join(__dirname, './public/');

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.sendFile(filePath + 'index.html');
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', api_router);
app.get('*', (req, res) => {
	res.send('Cant find the requested page');
});

const connect_string = process.env.CONNECT_MONGOOSE;

main().catch((err) => console.log(err));

async function main() {
	await mongoose.connect(connect_string);
	console.log('Connection to db open');
}

app.listen(PORT, function () {
	console.log('op-fs-project-2 server running on port ' + PORT + '!');
});
