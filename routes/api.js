const express = require('express');
const lintuLaji = require('../modules/model');
const router = express.Router();

router.get('/getall', async (req, res) => {
	try {
		const linnut = await lintuLaji.find();
		console.log('Kaikki linnut');
		console.log(linnut);
		res.json(linnut);
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
		const lintu = await lintuLaji.findById(birdId);

		// Check if a bird was found
		if (!lintu) {
			// If no bird was found, send a 404 response
			return res.status(404).send('Bird not found');
		}

		res.json(lintu);
		// Get the name of the bird
		const birdName = lintu.name;

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
		const { name } = req.body;

		const lintu = new lintuLaji({
			name: name,
		});
		await lintu.save();
		console.log(`${lintu.name} added to db`);
		res.send(`${lintu.name} added to db`);
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
		const deletedBird = await lintuLaji.findByIdAndDelete(birdId);

		// Check if a bird was found and deleted
		if (!deletedBird) {
			// If no bird was found, send a 404 response
			return res.status(404).send('Bird not found');
		}

		// Send a success message in the response
		res.send('Bird deleted successfully');
	} catch (err) {
		// Error handling
		console.error(err);
		res.status(500).send(err);
	}
});

router.put('/update/:id', async (req, res) => {
	try {
		const birdId = req.params.id; // Get the birdId from the route parameters
		const newName = req.body.name; // Get the new name from the request body

		// Check if the new name already exists in the database
		const existingBird = await lintuLaji.findOne({ name: newName });
		if (existingBird) {
			return res
				.status(400)
				.send('Bird with the same name already exists');
		}

		// Find and update the bird with the specified birdId
		const updatedBird = await lintuLaji.findByIdAndUpdate(
			birdId,
			{ name: newName },
			{ new: true }
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
