const { MessageEmbed, WebhookClient } = require('discord.js');
module.exports = class MessageEvent {
	constructor(client) {
		this.client = client;
	}
	async run(message) {
		let client = this.client;
		try {
			let data = {};
			let prefix;
			let embed = new MessageEmbed();
			embed
				.setAuthor(
					message.author.tag,
					message.author.displayAvatarURL({ size: 2048 })
				)
				.setTimestamp();
			if (message.guild) {
				embed.setFooter(
					message.guild.name,
					message.guild.iconURL({ size: 2048 })
				);
				let guild = await client.findOrCreateGuild({ id: message.guild.id });
				data.guild = guild;
				let member = await client.findOrCreateMember({
					id: message.author.id,
					guildID: message.guild.id
				});
				data.member = member;
				message.client = client;
				prefix = client.functions.getPrefix(message, data);
				if (!prefix) return;
				if (guild.prefix === 'undefined' || guild.prefix === 'false') {
					guild.prefix = client.config.misc.prefix;
					guild.save();
				}
				data.guild.plugins.logs = {
					messageLogs: {
						enabled:
							data.guild.plugins.logs.messageLogs.enabled !== false
								? true
								: false,
						channel:
							data.guild.plugins.logs.messageLogs.channel !== undefined
								? data.guild.plugins.logs.messageLogs.channel
								: undefined,
						logs: {
							messageDelete: {
								enabled:
									data.guild.plugins.logs.messageLogs.logs.messageDelete
										.enabled !== true
										? false
										: true
							},
							messageUpdate: {
								enabled:
									data.guild.plugins.logs.messageLogs.logs.messageUpdate
										.enabled !== true
										? false
										: true
							},
							messageBulk: {
								enabled:
									data.guild.plugins.logs.messageLogs.logs.messageBulk
										.enabled !== true
										? false
										: true
							}
						}
					},
					serverLogs: {
						enabled:
							data.guild.plugins.logs.serverLogs.enabled !== false
								? true
								: false,
						channel:
							data.guild.plugins.logs.serverLogs.channel !== undefined
								? data.guild.plugins.logs.serverLogs.channel
								: undefined,
						logs: {
							channelCreate: {
								enabled:
									data.guild.plugins.logs.serverLogs.logs.channelCreate
										.enabled !== true
										? false
										: true
							},
							channelUpdate: {
								enabled:
									data.guild.plugins.logs.serverLogs.logs.channelUpdate
										.enabled !== true
										? false
										: true
							},
							channelDelete: {
								enabled:
									data.guild.plugins.logs.serverLogs.logs.channelDelete
										.enabled !== true
										? false
										: true
							},
							roleCreate: {
								enabled: data.guild.plugins.logs.serverLogs.logs.roleCreate
									.enabled
									? true
									: false
							},
							roleUpdate: {
								enabled: data.guild.plugins.logs.serverLogs.logs.roleUpdate
									.enabled
									? true
									: false
							},
							roleDelete: {
								enabled: data.guild.plugins.logs.serverLogs.logs.roleDelete
									.enabled
									? true
									: false
							},
							serverUpdate: {
								enabled: data.guild.plugins.logs.serverLogs.logs.serverUpdate
									.enabled
									? true
									: false
							},
							emojisChanges: {
								enabled: data.guild.plugins.logs.serverLogs.logs.emojisChanges
									.enabled
									? true
									: false
							}
						}
					},
					memberLogs: {
						enabled:
							data.guild.plugins.logs.memberLogs.enabled !== false
								? true
								: false,
						channel:
							data.guild.plugins.logs.memberLogs.channel !== undefined
								? data.guild.plugins.logs.memberLogs.channel
								: undefined,
						logs: {
							memberJoin: {
								enabled:
									data.guild.plugins.logs.memberLogs.logs.memberJoin.enabled !==
									true
										? false
										: true
							},
							memberLeave: {
								enabled:
									data.guild.plugins.logs.memberLogs.logs.memberLeave
										.enabled !== true
										? false
										: true
							},
							roleUpdate: {
								enabled:
									data.guild.plugins.logs.memberLogs.logs.roleUpdate.enabled !==
									true
										? false
										: true
							},
							nameChange: {
								enabled:
									data.guild.plugins.logs.memberLogs.logs.nameChange.enabled !==
									true
										? false
										: true
							},
							avatarChange: {
								enabled:
									data.guild.plugins.logs.memberLogs.logs.avatarChange
										.enabled !== true
										? false
										: true
							},
							memberBan: {
								enabled:
									data.guild.plugins.logs.memberLogs.logs.memberBan.enabled !==
									true
										? false
										: true
							},
							memberUnban: {
								enabled:
									data.guild.plugins.logs.memberLogs.logs.memberUnban
										.enabled !== true
										? false
										: true
							}
						}
					}
				};
				if (data.guild) data.guild.save();
			} else if (message.channel.type === 'dm') {
				embed.setFooter(
					client.user.username,
					client.user.displayAvatarURL({ size: 2048 })
				);
				prefix = client.config.misc.prefix;
				if (!message.content.startsWith(prefix)) return;
				if (message.content.toLowerCase().startsWith('prefijo')) {
					embed
						.setColor(client.colors.ginko)
						.setTitle(client.defaults.ginkoun + '**¡Hola!**')
						.setDescription(
							'¡¿Olvidaste mi prefijo?! No importa, aquí te lo digo; `' +
								prefix +
								'`'
						);
					message.channel.send({ embed });
					return;
				}
			}
			let colors = client.colors;
			message.colors = colors;
			let defaults = client.defaults;
			message.defaults = defaults;
			let discordPermissions = client.permissions;
			message.discordPermissions = discordPermissions;
			let { misc } = client.config;
			message.misc = misc;
			let user = await client.findOrCreateUser({ id: message.author.id });
			data.user = user;
			let dmserverprefix = message.guild
				? data.guild.prefix
				: client.config.misc.prefix;
			message.dmguildprefix = dmserverprefix;
			if (data.user) {
				data.user = {
					premium: user.premium !== false ? true : false,
					verified: user.verified !== false ? true : false,
					commandsUsed: user.commandsUsed !== 0 ? user.commandsUsed : 0,
					social: {
						reputation:
							user.social.reputation !== 0 ? user.social.reputation : 0,
						level: user.social.level !== 0 ? user.social.level : 0,
						money: user.social.money !== 0 ? user.social.money : 0,
						couple: user.social.couple !== 0 ? user.social.couple : 0,
						gender: user.social.gender !== 0 ? user.social.gender : 0, // si es 0 es indefinido, si es 1 es mujer, si es 2 es hombre
						birthday: user.social.birthday !== 0 ? user.social.birthday : 0,
						description:
							user.social.description !== 0 ? user.social.description : 0,
						badges: []
					}
				};
				user.save();
			}
			if (message.guild && data.guild.plugins.suggestions) {
				data.guild.plugins.suggestions = {
					enabled:
						data.guild.plugins.suggestions.enabled !== false ? true : false,
					channel:
						data.guild.plugins.suggestions.channel !== undefined
							? data.guild.plugins.suggestions.channel
							: undefined,
					options: {
						autoDelete:
							data.guild.plugins.suggestions.options.autoDelete !== false
								? true
								: false,
						reply: {
							dm: {
								enabled:
									data.guild.plugins.suggestions.options.reply.dm.enabled !==
									false
										? true
										: false,
								message:
									data.guild.plugins.suggestions.options.reply.dm.message !==
									undefined
										? data.guild.plugins.suggestions.options.reply.dm.message
										: undefined
							},
							channel: {
								enabled:
									data.guild.plugins.suggestions.options.reply.channel
										.enabled !== false
										? true
										: false,
								message:
									data.guild.plugins.suggestions.options.reply.channel
										.message !== '¡Gracias por tu sugerencia, {autor:menion}!'
										? data.guild.plugins.suggestions.options.reply.channel
												.message
										: '¡Gracias por tu sugerencia, {autor:mencion}!'
							}
						}
					}
				};
				data.guild.save();
			}
			if (message.content.match(new RegExp(`^<@!?${client.user.id}>( |)$`))) {
				embed
					.setColor(colors.ginko)
					.setTitle(defaults.ginkoun + '**¡Hola!**')
					.setDescription(
						(message.guild ? 'El prefijo del servidor es ' : 'Mi prefijo es ') +
							'`' +
							dmserverprefix +
							'`\nPuedes ver la ayuda utilizando `' +
							dmserverprefix +
							'ayuda`'
					);
				message.channel.send({ embed });
			}
			let args = message.content
					.slice(prefix.length)
					.trim()
					.split(/ +/g),
				command = args.shift().toLowerCase(),
				cmd =
					client.commands.get(command) ||
					client.commands.get(client.aliases.get(command));
			if (!cmd) return;
			if (!cmd.config.enabled) {
				embed
					.setColor(colors.red)
					.setTitle(defaults.error)
					.setDescription('¡Este comando está deshabilitado!');
				return message.channel.send({ embed });
			}
			if (
				cmd.config.ownerOnly &&
				!client.config.misc.owners.includes(message.author.id)
			) {
				embed
					.setColor(colors.red)
					.setTitle(defaults.error)
					.setDescription('¡Este comando es solo para dueños del bot!');
				return message.channel.send({ embed });
			}
			if (cmd.config.guildOnly && !message.guild) {
				embed
					.setColor(colors.red)
					.setTitle(defaults.error)
					.setDescription(
						'¡Este comando solo puede ser ejecutado en un servidor!'
					);
				return message.channel.send({ embed });
			}
			if (message.guild) {
				if (cmd.config.nsfwOnly && !message.channel.nsfw) {
					embed
						.setColor(colors.red)
						.setTitle(defaults.error)
						.setDescription(
							'¡Este comando solo puede ser ejecutado en canales marcados como NSFW!'
						);
					return message.channel.send({ embed });
				}
				let neededPermissions = [];
				if (!cmd.config.botPermissions.includes('EMBED_LINKS')) {
					cmd.config.botPermissions.push('EMBED_LINKS');
				}
				if (!cmd.config.botPermissions.includes('SEND_MESSAGES')) {
					cmd.config.botPermissions.includes('SEND_MESSAGES');
				}
				cmd.config.botPermissions.forEach(p => {
					if (!message.channel.permissionsFor(message.guild.me).has(p)) {
						neededPermissions.push(p);
					}
				});
				if (neededPermissions.length > 0) {
					embed
						.setColor(colors.red)
						.setTitle(defaults.error)
						.setDescription(
							'No puedo utilizar este comando, necesito los siguientes permisos:\n`' +
								neededPermissions.map(p => p).join('`, `') +
								'`'
						);
					return message.channel.send({ embed });
				}
				neededPermissions = [];
				cmd.config.memberPermissions.forEach(p => {
					if (!message.channel.permissionsFor(message.member).has(p)) {
						neededPermissions.push(p);
					}
				});
				if (neededPermissions.length > 0) {
					embed
						.setColor(colors.red)
						.setTitle(defaults.error)
						.setDescription(
							'No puedes utilizar este comando, necesitas los siguientes permisos:\n`' +
								neededPermissions.map(p => p).join('`, `') +
								'`'
						);
					return message.channel.send({ embed });
				}
			}
			let webhook = new WebhookClient(
				client.config.tokens.logs.id,
				client.config.tokens.logs.token
			);
			try {
				cmd.run(message, args, data, embed);
				if (cmd.help.name === 'eval') {
					return;
				} else {
					webhook.send(
						`El usuario \`${message.author.tag}\`, ha usado el comando \`${
							cmd.help.name
						}\` en: \`${
							message.guild ? message.guild.name : `mensaje directo`
						}\``
					);
				}
			} catch (e) {
				if (cmd.help.name === 'eval') {
					return;
				} else {
					webhook.send(
						`El usuario \`${message.author.tag}\`, ha usado el comando \`${
							cmd.help.name
						}\` en: \`${
							message.guild ? message.guild.name : `mensaje directo`
						}\``
					);
				}
				console.log(e);
			} finally {
				user.commandsUsed += 1;
				user.save();
			}
		} catch (e) {
			console.log(e);
			client.postError({
				type: 'event',
				eventName: 'message',
				description: e
			});
		}
	}
};
