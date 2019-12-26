const Command = require('../../base/Command.js');

module.exports = class Owner extends Command {
	constructor(client) {
		super(client, {
			name: 'npm',
			description: 'Añade o remueve un paquete de NPM del código',
			usage: prefix => '`' + prefix + 'npm <añadir | remover> <npm>`',
			examples: prefix => '`' + prefix + 'npm añadir discord.js`',
			enabled: true,
			ownerOnly: true,
			guildOnly: false,
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
			let opciones = ['añadir', 'remover'];
			let cmd = require('child_process');
			if (!args[0]) {
				embed
					.setColor(message.colors.red)
					.setTitle(message.defaults.noargs)
					.setDescription(
						'Necesitas elegir una opción\nOpciones:\n`' +
							opciones.join('`, `') +
							'`'
					);
				message.channel.send({ embed });
				return;
			} else if (
				args[0].toLowerCase() === 'add' ||
				args[0].toLowerCase() === 'añadir'
			) {
				if (!args[1]) {
					embed
						.setColor(message.colors.red)
						.setTitle(message.defaults.noargs)
						.setDescription('Necesitas especificar el paquete a instalar');
					message.channel.send({ embed });
					return;
				} else {
					embed
						.setColor(message.colors.gray)
						.setTitle(message.defaults.grayun + 'Instalando paquete...')
						.setDescription('Sé paciente, esto puede durar unos minutos');
					let msg = await message.channel.send({ embed });
					cmd.exec('pnpm install ' + args[1] + ' --save', function(
						err,
						stdout,
						stderr
					) {
						if (err) {
							embed
								.setColor(message.colors.red)
								.setTitle(message.defaults.error)
								.setDescription(
									'Ha ocurrido un error y no se pudo instalar el paquete'
								);
							msg.edit({ embed });
							return;
						} else {
							embed
								.setColor(message.colors.green)
								.setTitle(message.defaults.done)
								.setDescription('El paquete se ha instalado correctamente');
							msg.edit({ embed });
							return;
						}
					});
				}
			} else if (
				args[0].toLowerCase() === 'remove' ||
				args[0].toLowerCase() === 'remover'
			) {
				if (!args[1]) {
					embed
						.setColor(message.colors.red)
						.setTitle(message.defaults.noargs)
						.setDescription('Necesitas especificar el paquete a desinstalar');
					message.channel.send({ embed });
					return;
				} else {
					embed
						.setColor(message.colors.gray)
						.setTitle(message.defaults.grayun + 'Desinstalando paquete...')
						.setDescription('Sé paciente, esto puede durar unos minutos');
					let msg = await message.channel.send({ embed });
					cmd.exec('pnpm uninstall ' + args[1] + ' --save', function(
						err,
						stdout,
						stderr
					) {
						if (err) {
							embed
								.setColor(message.colors.red)
								.setTitle(message.defaults.error)
								.setDescription(
									'Ha ocurrido un error y no se pudo desinstalar el paquete'
								);
							msg.edit({ embed });
							return;
						} else {
							embed
								.setColor(message.colors.green)
								.setTitle(message.defaults.done)
								.setDescription(
									'El paquete se ha desinstalado correctamente\n' +
										message.defaults.grayun +
										'Reiniciando bot...'
								);
							msg.edit({ embed });
							cmd.exec(`refresh`);
						}
					});
				}
			} else {
				embed
					.setColor(message.colors.red)
					.setTitle(message.defaults.error)
					.setDescription(
						'Esa no es una opción válida, las opciones válidas son:\n`' +
							opciones.join('`, `') +
							'`'
					);
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
