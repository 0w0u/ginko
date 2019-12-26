const Command = require('../../base/Command.js');

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			name: ' ',
			description: ' ',
			usage: prefix => '`' + prefix + '`',
			examples: prefix => '`' + prefix + '`',
			enabled: true,
			ownerOnly: false,
			guildOnly: true,
			nsfwOnly: false,
			cooldown: 5000,
			aliases: [],
			memberPermissions: [],
			botPermissions: [],
			dirname: __dirname
		});
	}

	async run(message, args, data, embed) {
		try {
			let channel, channels;
			if (!args[0]) {
				embed
					.setColor(message.colors.red)
					.setTitle(message.defaults.noargs)
					.setDescription('Necesias mencionar un canal');
				return message.channel.send({ embed });
			} else {
				channel = message.mentions.channels.first();
				if (channel) return await o(channel);
				else
					channels = message.guild.channels
						.array()
						.filter(m =>
							`${m.name}`.toLowerCase().includes(args.join(' ').toLowerCase())
						);
				if (channels.length < 1) {
					embed
						.setColor(message.colors.red)
						.setTitle(message.defaults.error)
						.setDescription(
							'No hay ningún canal que coincida con tu búsqueda, ¡intenta ser más específico!'
						);
					return message.channel.send({ embed });
				} else if (channels.length === 1) {
					return await o(channels[0]);
				} else if (channels.length >= 10) {
					embed
						.setColor(message.colors.red)
						.setTitle(message.defaults.error)
						.setDescription(
							'Muchos canales coinciden con tu búsqueda, ¡intenta ser más específico!'
						);
					return message.channel.send({ embed });
				} else {
					let length = channels.length > 9 ? 10 : channels.length,
						text = 'Selecciona un número entre 1 y ' + length + '```js\n';
					for (let i = 0; i < length; i++) {
						text += `${i + 1} - ${channels[i].name},\n`;
					}
					let textS = text.split(',');
					textS.pop();
					embed
						.setColor(message.colors.gray)
						.setTitle(message.defaults.grayun + 'Esperando respuesta...')
						.setDescription(textS.join(',') + '```');
					let msg = await message.channel.send({ embed });
					let index = await message.channel.awaitMessages(
						m =>
							m.author.id == message.author.id &&
							m.content > 0 &&
							m.content < length + 1,
						{
							max: 1,
							time: 60000,
							errors: ['cancel', 'cancelar']
						}
					);
					if (!index.first()) {
						embed
							.setColor(message.colors.red)
							.setTitle(message.defaults.redun + '¡No se recibió respuesta!')
							.setDescription(
								'Debes seleccionar un número del índice, ¡inténtalo de nuevo!'
							);
						message.channel.send({ embed });
						if (
							message.channel
								.permissionsFor(this.client.user)
								.has('MANAGE_MESSAGES')
						)
							message.delete();
						msg.delete();
						return;
					} else {
						if (
							message.channel
								.permissionsFor(this.client.user)
								.has('MANAGE_MESSAGES')
						)
							message.delete();
						msg.delete();
						return await o(channels[index.first().content - 1]);
					}
				}
			}
			async function o(m) {
				embed.setColor(message.colors.ginko);
				message.channel.send({ embed });
			}
		} catch (e) {
			console.error(e);
			this.client.postError({
				type: 'command',
				message: message,
				commandName: this.help.name,
				description: e
			});
		}
	}
};
