const Command = require('../../base/Command.js'),
	math = require('math-expression-evaluator');

module.exports = class Help extends Command {
	constructor(client) {
		super(client, {
			name: 'calcular',
			description: 'Calcula una ecuación',
			usage: prefix => '`' + prefix + 'calcular <ecuación>`',
			examples: prefix =>
				'`' +
				prefix +
				'calcular 10 + 56 * 50`, `' +
				prefix +
				'calcular 36 / 15 * 2`',
			enabled: true,
			ownerOnly: false,
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
