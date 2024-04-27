// Purpose: Frontend JavaScript code for the Birdwatcher application

// Run function to get all birds and populate the dropdown menu with bird IDs when the page is loaded
window.onload = function () {
	getAllBirds(); // Call getAllBirds() when the page is loaded
	populateBirdIds(); // Call populateBirdIds() when the page is loaded
};
// Add an event listener to the refreshBirds button to call the getAllBirds function when clicked
document.getElementById('refreshBirds').addEventListener('click', function (e) {
	getAllBirds();
});

const infoDiv = document.getElementById('info');
const responseDiv = document.getElementById('response');

// Function to get all birds from the server and display them in the birdsList container
async function getAllBirds() {
	// Fetch all birds from the server with a GET request to the /api/getall route
	try {
		const response = await fetch('/api/getall');
		const birds = await response.json();
		const birdsListContainer = document.getElementById('birdsList');
		// Clear existing content and add a line break
		birdsListContainer.innerHTML = '<br>';
		// Add each bird to the list container
		birds.forEach((bird) => {
			const birdItem = document.createElement('div');
			const birdDate = new Date(bird.dateSeen);
			const formattedDate = birdDate.toLocaleDateString(); // Format the date as a string in the format MM/DD/YYYY
			birdItem.textContent = `User name: ${bird.userName}, Bird: ${bird.birdName}, Date seen: ${formattedDate} `;
			// Add the bird item to the birdsList container
			birdsListContainer.appendChild(birdItem);
		});
		// Catch any errors that occur during the fetch request
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

		// Define the desired order of fields
		const fieldOrder = [
			'userName',
			'birdName',
			'latinBirdName',
			'wingSpan',
			'sex',
			'dateSeen',
			'dateAdded',
		];

		const fieldLabels = {
			userName: 'User name',
			birdName: 'Bird',
			latinBirdName: 'Bird in latin',
			wingSpan: 'Wingspan',
			sex: 'Sex',
			dateSeen: 'Date seen',
			dateAdded: 'Date added',
		};

		// Display input fields in a form
		const form = document.createElement('form');
		const modifiedFields = {}; // Keep track of modified fields
		fieldOrder.forEach((fieldName) => {
			if (fieldName === 'sex') {
				// Create dropdown menu for the "Sex" field
				const label = document.createElement('label');
				label.textContent = `${fieldLabels[fieldName]}: `;
				const selectField = document.createElement('select');
				selectField.name = fieldName;

				// Define sex options
				const sexOptions = ['Undefined', 'Male', 'Female'];

				// Populate the dropdown menu with options
				sexOptions.forEach((option) => {
					const optionElement = document.createElement('option');
					optionElement.value = option.toLowerCase(); // Use lowercase value for consistency
					optionElement.textContent = option;
					selectField.appendChild(optionElement);
				});

				// Set the selected option based on the current value of the sex field
				selectField.value = bird[fieldName];

				// Add change event listener to track modifications
				selectField.addEventListener('change', () => {
					modifiedFields[fieldName] = selectField.value;
				});

				form.appendChild(label);
				form.appendChild(selectField);
			} else if (
				fieldName === 'userName' ||
				fieldName === 'dateSeen' ||
				fieldName === 'dateAdded'
			) {
				// Create text elements for username, date seen, and date added
				const textElement = document.createElement('div');
				textElement.textContent = `${fieldLabels[fieldName]}: ${
					fieldName === 'dateSeen' || fieldName === 'dateAdded'
						? new Date(bird[fieldName]).toLocaleDateString()
						: bird[fieldName]
				}`;
				form.appendChild(textElement);
			} else {
				// Create input fields for other fields
				const label = document.createElement('label');
				label.textContent = `${fieldLabels[fieldName]}: `;
				const inputField = createInputField(fieldName, bird[fieldName]);

				// Add input event listener to track modifications
				inputField.addEventListener('input', () => {
					modifiedFields[fieldName] = inputField.value;
				});
				form.appendChild(label);
				form.appendChild(inputField);
			}
			form.appendChild(document.createElement('br')); // Add line break after each field
		});

		// Add a submit button
		const saveButton = document.createElement('button');
		saveButton.textContent = 'Save';
		saveButton.onclick = async (event) => {
			event.preventDefault(); // Prevent default form submission behavior
			saveUpdatedBird(); // Call saveUpdatedBird() when the submit button is clicked
		};
		// Add keydown event listener to the document
		document.addEventListener('keydown', (event) => {
			// Check if the pressed key is the "Enter" key (key code 13)
			if (event.keyCode === 13) {
				// Check if the save button is visible
				if (saveButton.style.display !== 'none') {
					// Prevent default behavior of the "Enter" key
					event.preventDefault();
					// Trigger the click event of the submit button
					saveButton.click();
				}
			}
		});
		// Add keydown event listener to the document
		document.addEventListener('keydown', (event) => {
			// Check if the pressed key is the "Enter" key (key code 13)
			if (event.keyCode === 27) {
				// Check if the save button is visible
				if (cancelButton.style.display !== 'none') {
					// Prevent default behavior of the "Enter" key
					event.preventDefault();
					// Trigger the click event of the submit button
					cancelButton.click();
				}
			}
		});

		async function saveUpdatedBird() {
			// Check if any fields have been modified
			if (Object.keys(modifiedFields).length === 0) {
				infoDiv.innerHTML =
					'No changes were made, press ESC or cancel if You wish to abort.'; // Display a message in the infoDiv
				return; // Exit the function if no changes were made
			}
			try {
				const responseUpdate = await fetch(`/api/update/${id}`, {
					method: 'PUT',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(modifiedFields),
				});

				if (!responseUpdate.ok) {
					const errorMessage = await responseUpdate.text();
					alert(errorMessage); // Display an alert with the error message
				} else {
					getBird(id); // Call getBird() to display updated bird information'
					infoDiv.innerHTML =
						'Bird information updated successfully!'; // Show information of update in the infoDiv
					console.log('Bird information updated successfully!'); // Log success message
				}
			} catch (err) {
				console.error('Error:', err);
			}
		}

		// Add a cancel button
		const cancelButton = document.createElement('button');
		cancelButton.textContent = 'Cancel';
		cancelButton.onclick = (event) => {
			event.preventDefault(); // Prevent default form submission behavior
			getBird(id); // Call getBird() to display the bird information if the cancel button is clicked
			infoDiv.innerHTML = 'Updating canceled by the user.'; // Clear the infoDiv
		};
		form.appendChild(cancelButton);
		form.appendChild(saveButton); // Append the submit button to the form

		// Replace existing content with the form
		responseDiv.innerHTML = '';
		responseDiv.appendChild(form);
	} catch (err) {
		console.error('Error:', err);
	}
}

// Helper function to format date as DD/MM/YYYY
function formatDate(dateString) {
	const date = new Date(dateString);
	const day = date.getDate().toString().padStart(2, '0');
	const month = (date.getMonth() + 1).toString().padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

// Helper function to create a single input field
function createInputField(name, value, readonly = false) {
	const inputField = document.createElement('input');
	inputField.type = 'text';
	inputField.name = name;
	inputField.value = value;
	inputField.readOnly = readonly; // Set the readonly attribute
	return inputField;
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
						infoDiv.innerHTML = 'Bird deleted successfully!'; // Show information of deletion in the infoDiv
						console.log('Bird deleted successfully!'); // Log success message
						getAllBirds(); // Call getAllBirds() when bird is deleted
						populateBirdIds(); // Call populateBirdIds() when bird is deleted
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

			// Check if the birdSeen date is before 1860
			const minDate = new Date('1860-01-01');
			if (dateBirdSeen < minDate) {
				alert('Bird seen date cannot be before 1860.'); // Display an alert if the date is before 1986
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
				infoDiv.innerHTML = 'Bird added successfully!'; // Show information of addition in the infoDiv
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

	infoDiv.innerHTML = ''; // Clear the infoDiv	'

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
