// Load the express package to create a new express application
const express = require('express');
// Load the bird model schema from the model.js file in the modules folder
const bird = require('../modules/model');
// Create a new router instance to define the routes for the API
const router = express.Router();

// Define the route /getall to get all birds from the database
router.get('/getall', async (req, res) => {
	try {
		// Find all birds in the database with the find() method and store them in the birds variable
		const birds = await bird.find();
		console.log('Every bird in the database listed here:');
		console.log(birds);
		res.status(200).json(birds); // Send status code 200 to client for successful response and also send the birds in JSON format
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err); // Set status code 500 for server error to client
	}
});

// Define the route /get/:id to get a bird with a specific id from the database
router.get('/:id', async (req, res) => {
	// Try to get a bird with a specific id from the database
	try {
		const birdId = req.params.id; // Get the id from the route parameters
		// Find the bird with the specified id
		const birdNameWithId = await bird.findById(birdId);
		// Check if a bird was found
		if (!birdNameWithId) {
			// If no bird was found, send a 404 response
			return res.status(404).send('Bird with this ID not found');
		}
		res.status(200).json(birdNameWithId); // Send status code 200 to client for successful response and also send the specific bird in JSON format
		// Get the name of the specific bird
		const birdName = birdNameWithId.birdName;
		// Send the bird's id and name in the response
		console.log(
			`Get route is working and the bird was found with an ID: ${birdId} and the name: ${birdName} for the bird`
		);
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err); // Set status code 500 for server error to client
	}
});

// Define the route /add to add a new bird to the database
router.post('/add', async (req, res) => {
	// Try to add a new bird to the database with the provided details of the form wih the fields userName, birdName, latinBirdName, wingSpan, sex, dateSeen
	try {
		const { userName, birdName, latinBirdName, wingSpan, sex, dateSeen } =
			req.body;
		// Log the received request body for debugging
		console.log('Information received from the form as:', req.body);
		// Create a new bird document with the user provided details using the bird model schema
		const newBird = new bird({
			userName: userName,
			birdName: birdName,
			latinBirdName: latinBirdName,
			wingSpan: wingSpan,
			sex: sex,
			dateSeen: dateSeen,
		});
		// Save the new bird document to the database
		await newBird.save();
		console.log(`Bird named: ${newBird.birdName} added successfully to db`);
		res.status(200).send(
			`Add route is working and the bird named: ${newBird.birdName} added successfully to db`
		); // Send status code 200 to client for successful response and also send a success message to the client aswell as to the console
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err);
	}
});

// Define the route /delete/:id to delete a bird with a specific id from the database
router.delete('/delete/:id', async (req, res) => {
	// Try to delete a bird with a specific id from the database
	try {
		const birdId = req.params.id; // Get the birdId from the route parameters
		// Find and delete the bird with the specified birdId using the findByIdAndDelete() method
		const deletedBird = await bird.findByIdAndDelete(birdId);
		// Check if a bird was found and deleted
		if (!deletedBird) {
			// If no bird was found, send a 404 response
			return res.status(404).send('Bird not found');
		}
		// Send a success message in the response
		res.status(200).send(
			'Bird with ID: ' + birdId + ' deleted successfully'
		); // Send status code 200 to client for successful response and also send a success message to the client
		console.log('Bird deleted successfully:', deletedBird); // Log the deleted bird to the console
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err);
	}
});

// Define the route /update/:id to update a bird with a specific id in the database
router.put('/update/:id', async (req, res) => {
	// Try to update a bird with a specific id in the database
	try {
		const birdId = req.params.id; // Get the birdId from the route parameters
		const newBirdName = req.body.birdName; // Get the new name from the request body
		const newLatinBirdName = req.body.latinBirdName; // Get the new latin name from the request body
		const newWingSpan = req.body.wingSpan; // Get the new wing span input from the request body
		const newSex = req.body.sex; // Get the input for new sex from the request body
		// Find and update the bird with the specified birdId
		const updatedBird = await bird.findByIdAndUpdate(
			// Use the findByIdAndUpdate() method to find and update the bird
			birdId,
			{
				birdName: newBirdName,
				latinBirdName: newLatinBirdName,
				wingSpan: newWingSpan,
				sex: newSex,
			},
			{ new: true } // Return the updated document with ensuring the new option is set to true that will return the updated document with the new values
		);
		// Check if a bird was found and updated
		if (!updatedBird) {
			// If no bird was found, send a 404 response
			return res.status(404).send('Bird not found');
		}
		// Send the updated bird in the response
		res.status(200).send(updatedBird);
		// Log the updated bird to the console
		console.log('Bird updated with this information:', updatedBird); // Send status code 200 to client for successful response and also send the updated bird to the client
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
});

// Export the router to use in the server.js file
module.exports = router;
