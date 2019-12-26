const mongoose = require('mongoose');

module.exports = mongoose.model(
	'Member',
	new mongoose.Schema({
		id: { type: String },
		guildID: { type: String },
		rolesIDs: { type: Array, default: [] },
		moderation: {
			type: Object,
			default: {
				type: Object,
				warns: {
					amount: { type: Number, default: 0 },
					warns: {
						type: Array,
						default: [
							{
								type: Object,
								default: {
									author: { type: String },
									date: { type: Date },
									reason: { type: String }
								}
							}
						]
					}
				},
				mutes: {
					type: Object,
					amount: { type: Number, default: 0 },
					author: { type: String },
					date: { type: Date },
					reason: { type: String }
				}
			}
		}
	})
);
