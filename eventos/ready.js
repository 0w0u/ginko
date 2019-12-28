module.exports = class ReadyEvent {
	constructor(client) {
		this.client = client;
	}

	async run() {
		try {
			let client = this.client;
			let array = [
					'💻 ~ ¡Código abierto! https://github.com/wwmon/ginko',
					'🥑 ~ Comiendo palta',
					'🥑 ~ Comiendo aguacate',
					'❤️ ~ Jugando con Charlotte',
					'☔ ~ @' + this.client.user.tag,
					'🧩 ~ Atendiendo ' + this.client.users.size + ' usuarios',
					'🧩 ~ Viendo ' + this.client.guilds.size + ' servidores'
				],
				random = array[Math.floor(Math.random() * array.length)];
			setInterval(() => {
				client.user.setActivity(random);
			}, 15000);
		} catch (e) {
			console.log(e);
			this.client.postError({
				type: 'event',
				eventName: 'ready',
				description: e
			});
		}
	}
};
