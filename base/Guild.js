const mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	config = require('../main-config.js');

module.exports = mongoose.model(
	'Guild',
	new Schema({
		id: { type: String },
		membersData: { type: Object, default: {} },
		members: [{ type: Schema.Types.ObjectId, ref: 'Member' }],
		prefix: { type: String, default: config.misc.prefix },
		plugins: {
			type: Object,
			default: {
				logs: {
					messageLogs: {
						enabled: false,
						channel: undefined,
						logs: {
							messageDelete: {
								enabled: true
							},
							messageUpdate: {
								enabled: true
							},
							messageBulk: {
								enabled: true
							}
						}
					},
					serverLogs: {
						enabled: false,
						channel: undefined,
						logs: {
							channelCreate: {
								enabled: true
							},
							channelUpdate: {
								enabled: true
							},
							channelDelete: {
								enabled: true
							},
							roleCreate: {
								enabled: true
							},
							roleUpdate: {
								enabled: true
							},
							roleDelete: {
								enabled: true
							},
							serverUpdate: {
								enabled: true
							},
							emojisChanges: {
								enabled: true
							}
						}
					},
					memberLogs: {
						enabled: false,
						channel: undefined,
						logs: {
							memberJoin: {
								enabled: true
							},
							memberLeave: {
								enabled: true
							},
							roleUpdate: {
								enabled: true
							},
							nameChange: {
								enabled: true
							},
							avatarChange: {
								enabled: true
							},
							memberBan: {
								enabled: true
							},
							memberUnban: {
								enabled: true
							}
						}
					}
				},
				suggestions: {
					enabled: false,
					channel: undefined,
					options: {
						autoDelete: false,
						reply: {
							dm: {
								enabled: false,
								message: undefined
							},
							channel: {
								enabled: false,
								message: '¡Gracias por tu sugerencia, {autor:mencion}!'
							}
						}
					}
				},
				autoRoles: { roles: [] }
			}
		}
	})
);
