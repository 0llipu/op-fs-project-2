// Purpose: Frontend JavaScript code for the Birdwatcher application
window.onload = function () {
	// Check if the current page is index.html
	if (window.location.pathname === '/index.html') {
		// Code specific to index.html
		console.log('index.html loaded');
		createListOfBirds(); // Call createListOfBirds() when the page is loaded
		// Add your specific functionality here
	}
	// Check if the current page is birdinfo.html
	else if (window.location.pathname === '/birdinfo.html') {
		// Code specific to birdinfo.html
		console.log('birdinfo.html loaded');
		populateDropdownMenu(); // Call populateDropdownMenu() when the page is loaded
		// Add an event listener to the dropdown menu
		dropdownMenu.addEventListener('change', function () {
			// Get the selected option
			const selectedOption =
				dropdownMenu.options[dropdownMenu.selectedIndex];
			// Get the ID of the selected bird
			const selectedBirdId = selectedOption.value;

			// Call the moreInfoForBirdFromDropdownMenu function with the selected bird ID
			moreInfoForBirdFromDropdownMenu(selectedBirdId);
		});
	}
	// Check if the current page is addbird.html
	else if (window.location.pathname === '/addbird.html') {
		// Code specific to addbird.html
		// Add an event listener to the addBirdForm to call the addBirdToDatabase function when the form is submitted
		document
			.getElementById('addBirdForm')
			.addEventListener('submit', async function (event) {
				event.preventDefault(); // Prevent the default form submission behavior
				addBirdToDatabase(this); // Call the addBirdToDatabase function when the form is submitted with the form element as an argument
			});

		console.log('addbird.html loaded');
		// Add your specific functionality here
	}
};

// Define the infoDiv, responseDiv and dropdownMenu elements as global variables
const infoDiv = document.getElementById('info');
const responseDiv = document.getElementById('response');
const dropdownMenu = document.getElementById('birdIdSelect');

// Function to fetch all birds from the server and return the bird details object
async function fetchAllBirds() {
	// Fetch all birds from the server via a GET request to the /api/getall route
	try {
		const response = await fetch('/api/getall'); // Fetch all birds from the server with a GET request
		if (!response.ok) {
			// Check if the response is not successful
			throw new Error('Failed to fetch the list of birds'); // Throw an error if the response is not successful
		}
		if (response.ok) {
			// Check if the response is successful
			console.log(
				'Birds loaded successfully from the database and the list and the dropdown menu is populated!'
			); // Log success message to the console
		}
		const birds = await response.json(); // Parse the JSON response to get the bird details object from the server
		return birds; // Return the bird details object
		// Catch any errors that occur during the fetch request
	} catch (err) {
		console.error('Error:', err);
	}
}

// Function to get all birds from the server and display them in the birdsList container
async function createListOfBirds() {
	// Fetch all birds from the server with a GET request to the /api/getall route
	try {
		const birds = await fetchAllBirds(); // Fetch all birds from the server
		const birdsListContainer = document.getElementById('birdsList'); // Get the birdsList container element
		// Clear existing content and add a line break
		birdsListContainer.innerHTML = '<br>';
		// Add each bird to the list container
		birds.forEach((bird) => {
			const birdItem = document.createElement('div'); // Create a new div element for the bird item
			const birdDate = new Date(bird.dateSeen); // Create a new Date object from the dateSeen field
			const formattedDate = birdDate.toLocaleDateString(); // Format the date as a string in the format MM/DD/YYYY
			birdItem.textContent = `User name: ${bird.userName}, Bird: ${bird.birdName}, Date seen: ${formattedDate} `; // Set the text content of the bird item div element with the bird details
			// Add the bird item to the birdsList container
			birdsListContainer.appendChild(birdItem);
		});
		// Catch any errors that occur during the fetch request
	} catch (err) {
		console.error('Error:', err);
	}
}

// Function to populate the dropdown menu with bird IDs from the server and display the bird details when a bird ID is selected
async function populateDropdownMenu() {
	// Fetch all birds from the server with a GET request to the /api/getall route
	try {
		const birds = await fetchAllBirds(); // Fetch all birds from the server
		// Clear existing options from the dropdown menu
		dropdownMenu.innerHTML = '';
		// Add default option "Select a sighting" for the dropdown menu
		const defaultOption = document.createElement('option'); // Create a new option element for the default option
		defaultOption.textContent = 'Select a sighting:'; // Set the text content of the default option to "Select a sighting:"
		defaultOption.disabled = true; // Disable the default option so it cannot be selected
		defaultOption.selected = true; // Set the default option as selected by default
		dropdownMenu.appendChild(defaultOption); // Append the default option to the dropdown menu
		// Add each bird ID as an option to the dropdown menu
		birds.forEach((bird) => {
			// Create an option element for each bird with the bird ID as the value and the bird details as the text content
			const option = document.createElement('option');
			// Set the value and text content of the option element to the bird ID and bird details
			option.value = bird._id; // Set the value of the option to the bird ID
			option.textContent = `${bird.birdName} - User: ${
				// Set the text content of the option to the bird name and user name
				bird.userName // Get the user name from the bird object
			}, Date Seen: ${new Date(bird.dateSeen).toLocaleDateString()}`; // Get the date seen from the bird object and format it as a string
			// Append the option to the select element
			dropdownMenu.appendChild(option);
		});
		// Catch any errors that occur during the fetch request and log the error to the console
	} catch (err) {
		console.error('Error:', err);
	}
}

// Function to update a bird with the specified ID and display the update form with the current bird details
async function fetchBirdInfo(id) {
	// Fetch the current bird details from the server via a GET request to the /api/:id route
	try {
		const response = await fetch(`/api/${id}`); // Fetch the current bird details from the server
		if (!response.ok) {
			// Check if the response is not successful
			throw new Error('Failed to fetch bird details'); // Throw an error if the response is not successful
		}
		if (response.ok) {
			// Check if the response is successful
			console.log('Bird details loaded successfully from the database!'); // Log success message to the console
		}
		const bird = await response.json(); // Parse the JSON response to get the bird details object from the server
		return bird; // Return the bird details object
		// Catch any errors that occur during the fetch request
	} catch (err) {
		console.error('Error:', err);
	}
}

// Function to get a bird with the specified ID and display the bird details
async function moreInfoForBirdFromDropdownMenu() {
	// Get the bird ID from the dropdown menu and fetch the bird details from the server
	const id = dropdownMenu.value;
	infoDiv.innerHTML = ''; // Clear the infoDiv	'
	// Fetch the bird details with fetchBirdInfo function and the bird ID as an argument
	try {
		const bird = await fetchBirdInfo(id);
		// Create a div element to contain the bird data and buttons
		const birdDiv = document.createElement('div');
		// Set the inner HTML of the birdDiv to display the bird details in a readable format with line breaks
		birdDiv.innerHTML = `<br> User name: ${bird.userName} <br> Bird: ${
			bird.birdName
		} <br> Bird in latin: ${bird.latinBirdName} <br> Wingspan: ${
			bird.wingSpan
		} cm <br> Sex: ${bird.sex} <br> Date seen: ${new Date(
			bird.dateSeen
		).toLocaleDateString()} <br> Date added: ${new Date(
			bird.dateAdded
		).toLocaleDateString()} <br><br><p id="warning"> You can update or delete a bird here but be careful, <br> there is no possibilities to undo anything. </p><br>`;
		// Create an update button to update the bird information and add a click event listener to call the formToUpdateBird function with the bird ID as an argument
		const updateButton = document.createElement('button'); // Create a new button element for the update button
		updateButton.id = 'updateButton'; // Set the id of the update button to "updateButton"
		updateButton.textContent = 'Update bird information'; // Set the text content of the update button to "Update bird information"
		updateButton.onclick = () => formToUpdateBird(bird._id); // Add a click event listener to the update button to call the formToUpdateBird function with the bird ID as an argument
		birdDiv.appendChild(updateButton); // Append the update button to the birdDiv
		// Create delete button to delete the bird and add a click event listener to call the deleteBird function with the bird ID as an argument
		const deleteButton = document.createElement('button'); // Create a new button element for the delete button
		deleteButton.id = 'deleteButton'; // Set the id of the delete button to "deleteButton"
		deleteButton.textContent = 'Delete this bird'; // Set the text content of the delete button to "Delete this bird"
		deleteButton.onclick = () => deleteBird(bird._id); // Add a click event listener to the delete button to call the deleteBird function with the bird ID as an argument
		birdDiv.appendChild(deleteButton); // Append the delete button to the birdDiv
		// Clear the responseDiv and append the birdDiv
		responseDiv.innerHTML = '';
		responseDiv.appendChild(birdDiv);
		// Catch any errors that occur during the fetch request and display an error message in the responseDiv
	} catch (err) {
		responseDiv.innerHTML = 'Error: Bird not found'; // Display an error message in the responseDiv
		console.error(err); // Log the error to the console
	}
}

// Function to add a new bird to the database
async function addBirdToDatabase(form) {
	// Add a new bird to the database via a POST request to the /api/add route
	try {
		// Get the form data and convert it to a JSON object
		const formData = new FormData(form); // Create FormData object from the form to add a bird
		const formDataObject = Object.fromEntries(formData.entries()); // Convert FormData to object
		// Check if the birdSeen date is in the future and display an alert if it is
		const dateBirdSeen = new Date(formDataObject.dateSeen); // Convert the dateSeen field to a Date object
		const currentDate = new Date(); // Get the current date
		if (dateBirdSeen > currentDate) {
			// Check if the birdSeen date is larger than the current date
			alert('Bird seen date cannot be in the future.'); // Display an alert if the date is in the future
			return; // Exit the function if the date is in the future
		}
		// Check if the birdSeen date is before 1860 and display an alert if it is
		const minDate = new Date('1860-01-01'); // Set the minimum date to 1860-01-01 (First bird has been seen in the early 1860s)
		if (dateBirdSeen < minDate) {
			// Check if the birdSeen date is smaller than the minimum date (1860-01-01)
			alert('Bird seen date cannot be before 1860.'); // Display an alert if the date is before 1860
			return; // Exit the function if the date is before 1860
		}
		const response = await fetch('/api/add', {
			// Open a fetch request to the /api/add route to add a new bird
			// Submit form data to backend route /api/add
			method: 'POST',
			headers: {
				'Content-Type': 'application/json', // Specify content type as JSON
			},
			body: JSON.stringify(formDataObject), // Convert object to JSON string
		});
		// Check if the response is not successful and display an error message if the addition fails
		if (!response.ok) {
			const errorMessage = await response.text(); // Parse the response as text
			alert(errorMessage); // Display an alert with the error message
		} else {
			form.reset(); // Reset the form
			infoDiv.innerHTML = ''; // Clear the infoDiv
			infoDiv.innerHTML = 'Bird added successfully!'; // Show information of addition in the infoDiv
		}
		// Catch any errors that occur during the fetch request and log the error to the console
	} catch (err) {
		console.error('Error:', err);
		alert('An error occurred while adding the bird.'); // Display generic error message
	}
}

// Function to update a bird with the specified ID and display the update form with the current bird details
async function formToUpdateBird(id) {
	// Function to update a bird with the specified ID
	try {
		const bird = await fetchBirdInfo(id); // Fetch the current bird details from the server
		const form = document.createElement('form'); // Create a new form element
		const modifiedFields = {}; // Create an empty object to store modified fields in the form submission process (initially empty)
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
		// Define field labels for the form
		const fieldLabels = {
			userName: 'User name',
			birdName: 'Bird',
			latinBirdName: 'Bird in latin',
			wingSpan: 'Wingspan',
			sex: 'Sex',
			dateSeen: 'Date seen',
			dateAdded: 'Date added',
		};
		// Create a form element to contain the input fields and buttons for updating the bird information and track modified fields in the form submission process
		fieldOrder.forEach((fieldName) => {
			// Iterate over the field order array
			if (fieldName === 'sex') {
				// Check if the field name equals sex
				// Create dropdown menu for the "Sex" field
				const label = document.createElement('label'); // Create a new label element
				label.textContent = `${fieldLabels[fieldName]}: `; // Set the text content of the label element to the field label text from the fieldLabels object
				const selectField = document.createElement('select'); // Create a new select element for the dropdown menu to select the sex for the bird
				selectField.name = fieldName; // Set the name attribute of the select element to the field name
				// Define options for the sex field dropdown menu
				const sexOptions = ['Undefined', 'Male', 'Female'];
				// Populate the dropdown menu with options to choose from
				sexOptions.forEach((option) => {
					const optionElement = document.createElement('option');
					optionElement.value = option.toLowerCase(); // Use lowercase value for consistency
					optionElement.textContent = option;
					selectField.appendChild(optionElement);
				});
				// Set the selected option based on the current value of the sex field from the bird object
				selectField.value = bird[fieldName];
				// Add change event listener to track modifications
				selectField.addEventListener('change', () => {
					// Add an event listener to the selectField element to track changes in the selected value of the dropdown menu
					modifiedFields[fieldName] = selectField.value; // Update the modifiedFields object with the new value when the selection changes
				});
				// Append the label and selectField elements to the form element
				form.appendChild(label);
				form.appendChild(selectField);
			} else if (
				// Check if the field name equals userName, dateSeen, or dateAdded and if so create text elements for these fields
				fieldName === 'userName' ||
				fieldName === 'dateSeen' ||
				fieldName === 'dateAdded'
			) {
				// Create text elements for username, date seen, and date added
				const textElement = document.createElement('div'); // Create a new div element for the text content
				textElement.textContent = `${fieldLabels[fieldName]}: ${
					// Set the text content of the text element to the field label text from the fieldLabels object and the corresponding value from the bird object
					fieldName === 'dateSeen' || fieldName === 'dateAdded' // Check if the field name equals dateSeen or dateAdded and format the date accordingly
						? new Date(bird[fieldName]).toLocaleDateString()
						: bird[fieldName]
				}`;
				// Append the text element to the form element
				form.appendChild(textElement);
			} else {
				// Create input fields for other fields that are not userName, dateSeen, dateAdded
				const label = document.createElement('label'); // Create a new label element for the input field label text content from the fieldLabels object and the corresponding value from the bird object
				label.textContent = `${fieldLabels[fieldName]}: `; // Set the text content of the label element to the field label text from the fieldLabels object and the corresponding value from the bird object
				const inputField = createInputField(fieldName, bird[fieldName]); // Create an input field element with the field name and value from the bird object
				// Add input event listener to track modifications in the input fields and update the modifiedFields object accordingly when the input changes
				inputField.addEventListener('input', () => {
					modifiedFields[fieldName] = inputField.value;
				});
				// Append the label and inputField elements to the form element
				form.appendChild(label);
				form.appendChild(inputField);
			}
			form.appendChild(document.createElement('br')); // Add line break after each field
		});
		// Add a submit button to save the updated bird information and a cancel button to cancel the update process
		const saveButton = document.createElement('button'); // Create a new button element for the submit button
		saveButton.id = 'saveButton'; // Set the id of the submit button to "saveButton"
		saveButton.textContent = 'Save'; // Set the text content of the submit button to "Save"
		saveButton.onclick = async (event) => {
			// Add a click event listener to the submit button to call the saveUpdatedBird function when clicked
			event.preventDefault(); // Prevent default form submission behavior
			saveUpdatedBird(id, modifiedFields); // Call saveUpdatedBird() when the submit button is clicked
		};
		// Add a cancel button to cancel the update process if the user decides so
		const cancelButton = document.createElement('button'); // Create a new button element for the cancel button
		cancelButton.id = 'cancelButton'; // Set the id of the cancel button to "cancelButton"
		cancelButton.textContent = 'Cancel'; // Set the text content of the cancel button to "Cancel"
		cancelButton.onclick = (event) => {
			// Add a click event listener to the cancel button to cancel the update process
			event.preventDefault(); // Prevent default form submission behavior
			moreInfoForBirdFromDropdownMenu(id); // Call moreInfoForBirdFromDropdownMenu() to display the bird information if the cancel button is clicked
			infoDiv.innerHTML = 'Updating canceled by the user.'; // Clear the infoDiv
		};
		form.appendChild(cancelButton); // Append the cancel button to the form
		form.appendChild(saveButton); // Append the submit button to the form
		// Add keydown event listener to the document to listen for the "Enter" key press and connect it to the save button
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
		// Add keydown event listener to the document to listen for the "Escape" key press and connect it to the cancel button
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
		// Replace existing content with the form
		responseDiv.innerHTML = '';
		responseDiv.appendChild(form); // Append the form element to the responseDiv
		// Catch any errors that occur during the try block execution and log the error to the console
	} catch (err) {
		console.error('Error:', err);
	}
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

// Function to save the updated bird information to the server and display a success message or an error message if the update fails
async function saveUpdatedBird(id, modifiedFields) {
	// Check if any fields have been modified
	if (Object.keys(modifiedFields).length === 0) {
		// Check if the modifiedFields object is empty (no fields have been modified) by checking the length of the object keys array
		infoDiv.innerHTML =
			'No changes were made, press ESC or cancel if You wish to abort.'; // Display a message in the infoDiv
		return; // Exit the function if no changes were made
	}
	// Fetch the updated bird information to the server with a PUT request to the /api/update/:id route
	try {
		const responseUpdate = await fetch(`/api/update/${id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(modifiedFields), // Convert the modifiedFields object to a JSON string and send it in the request body to the server for updating the bird information
		});
		// Check if the response is not successful and display an error message if the update fails
		if (!responseUpdate.ok) {
			const errorMessage = await responseUpdate.text();
			alert(errorMessage); // Display an alert with the error message
			// Log the error message to the console and display an error message in the infoDiv
		} else {
			// Display a success message in the infoDiv if the update is successful
			moreInfoForBirdFromDropdownMenu(id); // Call moreInfoForBirdFromDropdownMenu() to display updated bird information'
			infoDiv.innerHTML = 'Bird information updated successfully!'; // Show information of update in the infoDiv
			console.log('Bird information updated successfully!'); // Log success message
		}
		// Catch any errors that occur during the try block execution and log the error to the console
	} catch (err) {
		console.error('Error:', err);
	}
}

// Function to delete a bird with the specified ID and display a confirmation prompt before deleting the bird
async function deleteBird(id) {
	try {
		const bird = await fetchBirdInfo(id);
		const currentBirdName = bird.birdName; // Get the bird name from the bird details object
		// Prompt the user to enter the name of the bird to confirm deletion
		const birdName = prompt(
			`Please enter the name of the bird "${currentBirdName}" to confirm deletion:`
		);
		// Check if the birdName variable is not empty
		if (birdName) {
			// Check if the entered bird name matches the actual bird name
			if (
				birdName.trim().toLowerCase() === // Trim and convert the entered bird name to lowercase for comparison
				currentBirdName.trim().toLowerCase() // Trim and convert the actual bird name to lowercase for comparison
			) {
				// Display a confirmation prompt to confirm the deletion of the bird
				const confirmation = confirm(
					`Are you sure you want to delete the bird "${currentBirdName}"?` // Display a confirmation prompt to confirm the deletion of the bird with the actual bird name as the message text
				);
				// Check if the user confirms the deletion of the bird and delete the bird if confirmed
				if (confirmation) {
					try {
						// Try to delete the bird with the specified ID
						await fetch(`/api/delete/${id}`, {
							// Fetch the bird details from the server via a DELETE request to the /api/delete/:id route
							method: 'DELETE',
						});
						populateDropdownMenu(); // Call populateDropdownMenu() when bird is deleted
						responseDiv.innerHTML = ''; // Clear the responseDiv
						infoDiv.innerHTML = 'Bird deleted successfully!'; // Show information of deletion in the infoDiv
						console.log('Bird deleted successfully!'); // Log success message
						// Catch any errors that occur during the fetch request and log the error to the console
					} catch (err) {
						console.error('Error:', err);
					}
				}
				// Display an alert if the entered bird name does not match the actual bird name and the deletion is aborted
			} else {
				alert(
					'The entered bird name does not match the actual bird name. Deletion aborted.'
				);
			}
			// Display an alert if the user does not enter the bird name and the deletion is aborted
		} else {
			alert('Please enter the name of the bird to confirm deletion.');
		}
		// Catch any errors that occur during the fetch request and log the error to the console
	} catch (err) {
		console.error('Error:', err);
	}
}
