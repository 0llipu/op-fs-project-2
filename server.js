// Description: This file is the entry point for the server. It sets up the server and connects to the database.
// Apply the dotenv package to load environment variables from a .env file.
require('dotenv').config();
// Import the express package to create a new express application.
const express = require('express');
// Import the api_router from the routes/api.js file.
const api_router = require('./routes/api');
// Import the mongoose package to connect to the MongoDB database.
var mongoose = require('mongoose');
// Create a new express application and store it in the app variable.
const app = express();
// Define the port number for the server to listen on using the SERVER_PORT environment variable.
const PORT = process.env.SERVER_PORT;
// Import the path package to work with file paths.
const path = require('path');
// Define the file path to the public folder.
const filePath = path.join(__dirname, './public/');
// Serve the static files in the public folder using the express.static middleware.
app.use(express.static('public'));
// Define the route for the home page to serve the index.html file.
app.get('/', (req, res) => {
	res.sendFile(filePath + 'index.html');
});
// Use the express.json() and express.urlencoded() middleware to parse JSON and URL-encoded request bodies.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Define the route for the /api endpoint to use the api_router for handling API routes.
app.use('/api', api_router);
app.get('*', (req, res) => {
	res.status(404).send('Cant find the requested page'); // Send a 404 response for any other routes not defined.
});
// Define the connection string to the MongoDB database using the CONNECT_MONGOOSE environment variable.
const connect_string = process.env.CONNECT_MONGOOSE;
// Catch any error that occurs during the main function execution.
main().catch((err) => console.log(err));
// Define the main function to connect to the MongoDB database using the mongoose package.
async function main() {
	await mongoose.connect(connect_string);
	console.log('Connection to bird database is now open');
}
// Start the server to listen on the defined port number.
app.listen(PORT, function () {
	console.log(
		'The server for the op-fs-project-2 is running on port ' + PORT + '!'
	);
});
