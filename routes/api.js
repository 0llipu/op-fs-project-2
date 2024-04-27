const express = require('express');
const bird = require('../modules/model');
const router = express.Router();

router.get('/getall', async (req, res) => {
	try {
		const birds = await bird.find();
		console.log('Kaikki linnut listattuna');
		console.log(birds);
		res.json(birds);
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err);
	}
});

router.get('/:id', async (req, res) => {
	try {
		const birdId = req.params.id; // Get the id from the route parameters

		// Find the bird with the specified id
		const birdNameWithId = await bird.findById(birdId);

		// Check if a bird was found
		if (!birdNameWithId) {
			// If no bird was found, send a 404 response
			return res.status(404).send('Bird with this ID not found');
		}

		res.json(birdNameWithId);
		// Get the name of the bird
		const birdName = birdNameWithId.birdName;

		// Send the bird's id and name in the response
		console.log(`ID for the bird: ${birdId}, Name: ${birdName}`);
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err);
	}
});

router.post('/add', async (req, res) => {
	try {
		const { userName, birdName, latinBirdName, wingSpan, sex, dateSeen } =
			req.body;

		// Log the received request body for debugging
		console.log('Received request body:', req.body);

		// Create a new bird document with the provided details
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

		console.log(`${newBird.birdName} added to db`);
		res.send(`${newBird.birdName} added to db`);
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err);
	}
});

router.delete('/delete/:id', async (req, res) => {
	try {
		const birdId = req.params.id; // Get the birdId from the route parameters

		// Find and delete the bird with the specified birdId
		const deletedBird = await bird.findByIdAndDelete(birdId);

		// Check if a bird was found and deleted
		if (!deletedBird) {
			// If no bird was found, send a 404 response
			return res.status(404).send('Bird not found');
		}

		// Send a success message in the response
		res.send('Bird with ID: ' + birdId + ' deleted successfully');
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err);
	}
});

router.put('/update/:id', async (req, res) => {
	try {
		const birdId = req.params.id; // Get the birdId from the route parameters
		const newBirdName = req.body.birdName; // Get the new name from the request body
		const newLatinBirdName = req.body.latinBirdName;
		const newWingSpan = req.body.wingSpan;
		const newSex = req.body.sex;

		// Find and update the bird with the specified birdId
		const updatedBird = await bird.findByIdAndUpdate(
			birdId,
			{
				birdName: newBirdName,
				latinBirdName: newLatinBirdName,
				wingSpan: newWingSpan,
				sex: newSex,
			},
			{ new: true } // Return the updated document
		);

		// Check if a bird was found and updated
		if (!updatedBird) {
			// If no bird was found, send a 404 response
			return res.status(404).send('Bird not found');
		}

		// Send the updated bird in the response
		res.send(updatedBird);
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send('Internal Server Error');
	}
});

module.exports = router;
