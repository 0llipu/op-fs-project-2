const mongoose = require('mongoose');

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

module.exports = mongoose.model('Bird', birdSchema);
