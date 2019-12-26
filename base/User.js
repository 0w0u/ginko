const mongoose = require('mongoose');

module.exports = mongoose.model(
	'User',
	new mongoose.Schema({
		id: { type: String },
		premium: false,
		verified: false,
		commandsUsed: 0,
		social: {
			reputation: 0,
			level: 0,
			money: 0,
			couple: 0, // string, undefined
			gender: 0, // si es 0 es indefinido, si es 1 es mujer, si es 2 es hombre
			birthday: 0, // string, date
			description: 0, //string undefined
			badges: []
		}
	})
);
