// Load mongoose library
const mongoose = require('mongoose');

// Create a schema for the bird collection with the required fields of userName, birdName, wingSpan, sex, dateSeen and a default field of dateAdded and an unrequired field of latinBirdName
const birdSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: true,
		minlength: 3,
	},
	birdName: {
		type: String,
		required: true,
		minlength: 3,
	},
	latinBirdName: {
		type: String,
	},
	wingSpan: {
		type: Number,
		minlength: 1,
	},
	sex: {
		type: String,
		enum: ['male', 'female', 'undefined'],
		required: true,
	},
	dateSeen: {
		type: Date,
		required: true,
		default: Date.now,
	},
	dateAdded: {
		type: Date,
		default: Date.now,
	},
});

// Export the schema as a model
module.exports = mongoose.model('Bird', birdSchema);
