// Function to refresh the list of birds
window.onload = function () {
	getAllBirds(); // Call getAllBirds() when the page is loaded
};

async function refreshBirds() {
	getAllBirds(); // Call the function to get all birds again
}

// Function to update a bird's name
async function updateBirdName(id) {
	try {
		const existingNameElement = document.getElementById(`birdName-${id}`);
		if (!existingNameElement) {
			console.error(`Element with ID 'birdName-${id}' not found.`);
			return;
		}

		const existingName = existingNameElement.textContent; // Get the existing name from the list
		const newName = prompt(
			`Enter new name for the bird (current name: ${existingName}):`
		);

		if (newName === null) {
			// User canceled the prompt
			return;
		}

		if (newName === '') {
			alert('Please enter a valid name.'); // Notify the user to enter a valid name
			return;
		}

		if (newName === existingName) {
			alert('Please enter a different name to update.'); // Notify the user to enter a different name
			return;
		}

		const response = await fetch(`/api/update/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: newName }),
		});

		if (!response.ok) {
			const errorMessage = await response.text();
			alert(errorMessage); // Display an alert with the error message
		} else {
			refreshBirds();
		}
	} catch (err) {
		console.error('Error:', err);
	}
}

// Function to delete a bird
async function deleteBird(id) {
	const confirmation = confirm('Are you sure you want to delete this bird?');
	if (confirmation) {
		try {
			await fetch(`/api/delete/${id}`, {
				method: 'DELETE',
			});
			refreshBirds();
		} catch (err) {
			console.error('Error:', err);
		}
	}
}

async function getAllBirds() {
	try {
		const response = await fetch('/api/getall');
		const birds = await response.json();
		const birdsListContainer = document.getElementById('birdsList');

		// Clear existing content
		birdsListContainer.innerHTML = '';

		// Add each bird to the list
		birds.forEach((bird) => {
			const birdItem = document.createElement('div');
			birdItem.textContent = `ID: ${bird._id}, Name: ${bird.name}`;

			// Add buttons for updating and deleting each bird
			const updateButton = document.createElement('button');
			updateButton.textContent = 'Update';
			updateButton.onclick = () => updateBirdName(bird._id);
			birdItem.appendChild(updateButton);

			const deleteButton = document.createElement('button');
			deleteButton.textContent = 'Delete';
			deleteButton.onclick = () => deleteBird(bird._id);
			birdItem.appendChild(deleteButton);

			birdsListContainer.appendChild(birdItem);
		});
	} catch (err) {
		console.error('Error:', err);
	}
}
// Function to add a new bird to the database
async function addBird() {
	try {
		const newName = prompt('Enter name for the new bird:');

		if (newName === null || newName === '') {
			// User canceled the prompt or entered an empty name
			return;
		}

		// Check if the entered name already exists in the list of birds
		const birdsResponse = await fetch('/api/getall');
		const birds = await birdsResponse.json();

		if (birds.some((bird) => bird.name === newName)) {
			alert('A bird with this name already exists.'); // Display an alert if the name already exists
			return;
		}

		const response = await fetch('/api/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name: newName }),
		});

		if (!response.ok) {
			const errorMessage = await response.text();
			alert(errorMessage); // Display an alert with the error message
		} else {
			refreshBirds(); // Update the list of birds
		}
	} catch (err) {
		console.error('Error:', err);
	}
}
async function getBird() {
	const birdId = document.getElementById('birdIdInput').value;
	const responseDiv = document.getElementById('response');

	try {
		const response = await fetch(`/api/${birdId}`);

		if (!response.ok) {
			// If response is not successful, throw an error
			throw new Error('Bird not found');
		}

		const data = await response.json();

		// Update HTML to display bird data
		responseDiv.innerHTML = `ID: ${data._id}, Name: ${data.name}`;
	} catch (err) {
		// Handle errors
		responseDiv.innerHTML = 'Error: Bird not found';
		console.error(err);
	}
}
