const mongoose = require('mongoose');

const lintuSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 3,
	},
});

module.exports = mongoose.model('lintuLaji', lintuSchema);
