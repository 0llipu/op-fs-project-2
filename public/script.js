// Function to refresh the list of birds
window.onload = function () {
	getAllBirds(); // Call getAllBirds() when the page is loaded
	populateBirdIds(); // Call populateBirdIds() when the page is loaded
};

document.getElementById('refreshBirds').addEventListener('click', function (e) {
	getAllBirds();
});

async function refreshBirds() {
	getAllBirds(); // Call the function to get all birds again
}

async function getAllBirds() {
	try {
		const response = await fetch('/api/getall');
		const birds = await response.json();
		const birdsListContainer = document.getElementById('birdsList');

		// Clear existing content
		birdsListContainer.innerHTML = '<br>';

		// Add each bird to the list
		birds.forEach((bird) => {
			const birdItem = document.createElement('div');
			const birdDate = new Date(bird.dateSeen);
			const formattedDate = birdDate.toLocaleDateString(); // Format: MM/DD/YYYY
			birdItem.textContent = `User name: ${bird.userName}, Bird: ${bird.birdName}, Date seen: ${formattedDate} `;

			birdsListContainer.appendChild(birdItem);
		});
	} catch (err) {
		console.error('Error:', err);
	}
}

async function updateBird(id) {
	try {
		const response = await fetch(`/api/${id}`); // Fetch current bird details
		if (!response.ok) {
			throw new Error('Failed to fetch bird details');
		}
		const bird = await response.json();

		// Show current information for the bird
		const existingBirdName = bird.birdName;
		const existingLatinBirdName = bird.latinBirdName;
		const existingWingspan = bird.wingSpan;
		const existingSex = bird.sex;

		const newBirdName = prompt(
			`Enter new name for the bird (current name: ${existingBirdName}):`,
			existingBirdName
		);
		const newLatinBirdName = prompt(
			`Enter new Latin name for the bird (current Latin name: ${existingLatinBirdName}):`,
			existingLatinBirdName
		);
		const newWingspan = prompt(
			`Enter new wingspan for the bird (current wingspan: ${existingWingspan}):`,
			existingWingspan
		);
		const newSex = prompt(
			`Enter new sex for the bird (current sex: ${existingSex}):`,
			existingSex
		);

		if (
			newBirdName === null ||
			newLatinBirdName === null ||
			newWingspan === null ||
			newSex === null
		) {
			// User canceled the prompt
			return;
		}

		if (
			newBirdName === '' ||
			newLatinBirdName === '' ||
			newWingspan === '' ||
			newSex === ''
		) {
			alert('Please enter valid values for all fields.'); // Notify the user to enter valid values for all fields
			return;
		}

		const responseUpdate = await fetch(`/api/update/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				name: newBirdName,
				latinName: newLatinBirdName,
				wingspan: newWingspan,
				sex: newSex,
			}),
		});

		if (!responseUpdate.ok) {
			const errorMessage = await responseUpdate.text();
			alert(errorMessage); // Display an alert with the error message
		} else {
			getAllBirds(); // Call getAllBirds() when bird is updated
			populateBirdIds(); // Call populateBirdIds() when bird is updated
		}
	} catch (err) {
		console.error('Error:', err);
	}
}

// Function to delete a bird
async function deleteBird(id) {
	try {
		// Fetch the current bird details from the server
		const response = await fetch(`/api/${id}`);
		if (!response.ok) {
			throw new Error('Failed to fetch bird details');
		}
		const birdDetails = await response.json();
		const currentBirdName = birdDetails.birdName;

		const birdName = prompt(
			`Please enter the name of the bird "${currentBirdName}" to confirm deletion:`
		);
		if (birdName) {
			// Check if the entered bird name matches the actual bird name
			if (
				birdName.trim().toLowerCase() ===
				currentBirdName.trim().toLowerCase()
			) {
				const confirmation = confirm(
					`Are you sure you want to delete the bird "${currentBirdName}"?`
				);
				if (confirmation) {
					try {
						await fetch(`/api/delete/${id}`, {
							method: 'DELETE',
						});
					} catch (err) {
						console.error('Error:', err);
					}
				}
			} else {
				alert(
					'The entered bird name does not match the actual bird name. Deletion aborted.'
				);
			}
		} else {
			alert('Please enter the name of the bird to confirm deletion.');
		}
		getAllBirds(); // Call getAllBirds() when bird is deleted
		populateBirdIds(); // Call populateBirdIds() when bird is deleted
	} catch (err) {
		console.error('Error:', err);
	}
}

document
	.getElementById('addBirdForm')
	.addEventListener('submit', async function (event) {
		event.preventDefault(); // Prevent the default form submission behavior

		try {
			const formData = new FormData(this); // Create FormData object from the form
			const formDataObject = Object.fromEntries(formData.entries()); // Convert FormData to object

			// Check if the birdSeen date is in the future
			const dateBirdSeen = new Date(formDataObject.dateSeen);
			const currentDate = new Date();
			if (dateBirdSeen > currentDate) {
				alert('Bird seen date cannot be in the future.'); // Display an alert if the date is in the future
				return;
			}

			// Check if the birdSeen date is before 1986
			const minDate = new Date('1986-01-01');
			if (dateBirdSeen < minDate) {
				alert('Bird seen date cannot be before 1986.'); // Display an alert if the date is before 1986
				return;
			}

			const response = await fetch('/api/add', {
				// Submit form data to backend route
				method: 'POST',
				headers: {
					'Content-Type': 'application/json', // Specify JSON content type
				},
				body: JSON.stringify(formDataObject), // Convert object to JSON string
			});

			if (!response.ok) {
				const errorMessage = await response.text();
				alert(errorMessage); // Display an alert with the error message
			} else {
				alert('Bird added successfully!'); // Display success message
				// Reset the form
				this.reset();
				getAllBirds(); // Call getAllBirds() when bird is added
				populateBirdIds(); // Call populateBirdIds() when bird is added
			}
		} catch (err) {
			console.error('Error:', err);
			alert('An error occurred while adding the bird.'); // Display generic error message
		}
	});

async function getBird() {
	const birdId = document.getElementById('birdIdSelect').value;
	const responseDiv = document.getElementById('response');

	try {
		const response = await fetch(`/api/${birdId}`);

		if (!response.ok) {
			// If response is not successful, throw an error
			throw new Error('Bird not found');
		}

		const bird = await response.json();

		// Create a div element to contain the bird data and buttons
		const birdDiv = document.createElement('div');

		// Update HTML to display bird data
		birdDiv.innerHTML = `<br> User name: ${bird.userName} <br> Bird: ${
			bird.birdName
		} <br> Bird in latin: ${bird.latinBirdName} <br> Wingspan: ${
			bird.wingSpan
		} cm <br> Sex: ${bird.sex} <br> Date seen: ${new Date(
			bird.dateSeen
		).toLocaleDateString()} <br> Date added: ${new Date(
			bird.dateAdded
		).toLocaleDateString()} <br><br><strong> If You wish to update or delete a bird You can do it here but be careful with Your actions, there is no possibilities to undo what You do. <strong><br><br>`;

		// Create update button
		const updateButton = document.createElement('button');
		updateButton.textContent = 'Update bird information';
		updateButton.onclick = () => updateBird(bird._id);
		birdDiv.appendChild(updateButton);

		// Create delete button
		const deleteButton = document.createElement('button');
		deleteButton.textContent = 'Delete this bird';
		deleteButton.onclick = () => deleteBird(bird._id);
		birdDiv.appendChild(deleteButton);

		// Clear the responseDiv and append the birdDiv
		responseDiv.innerHTML = '';
		responseDiv.appendChild(birdDiv);
	} catch (err) {
		// Handle errors
		responseDiv.innerHTML = 'Error: Bird not found';
		console.error(err);
	}
}

// Function to populate the dropdown menu with bird IDs
async function populateBirdIds() {
	try {
		const response = await fetch('/api/getall');
		const birds = await response.json();
		const birdIdSelect = document.getElementById('birdIdSelect');

		// Clear existing options
		birdIdSelect.innerHTML = '';

		// Add each bird ID as an option
		birds.forEach((bird) => {
			// Create an option element
			const option = document.createElement('option');

			// Set the value and text content of the option
			option.value = bird._id;
			option.textContent = `${bird.birdName} - User: ${
				bird.userName
			}, Date Seen: ${new Date(bird.dateSeen).toLocaleDateString()}`;

			// Append the option to the select element
			birdIdSelect.appendChild(option);
		});
	} catch (err) {
		console.error('Error:', err);
	}
}
