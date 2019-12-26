const { MessageEmbed } = require('discord.js');

module.exports = class GuildCreateEvent {
	constructor(client) {
		this.client = client;
	}

	async run(guild) {
		try {
			let embed = new MessageEmbed();
			embed
				.setAuthor(
					this.client.user.tag,
					this.client.user.displayAvatarURL({ size: 2048 })
				)
				.setColor(this.client.colors.green)
				.setTitle(this.client.defaults.greenun + '¡Me agregaron a un servidor!')
				.setDescription(guild.name + ' (`' + guild.id + '`)')
				.setThumbnail(guild.iconURL({ size: 2048 }))
				.addField('Dueño', guild.owner.user.tag, true)
				.addField('Miembros', guild.members.size, true)
				.addBlankField()
				.addField('Total de servidores', this.client.guilds.size, true)
				.addField('Total de usuarios', this.client.users.size, true)
				.setTimestamp();
			this.client.channels.get('623889082984169473').send({ embed });
		} catch (e) {
			console.log(e);
			this.client.postError({
				type: 'event',
				eventName: 'guildCreate',
				description: e
			});
		}
	}
};
