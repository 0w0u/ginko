const { MessageEmbed } = require('discord.js');

module.exports = class GuildMemberRemoveEvent {
	constructor(client) {
		this.client = client;
	}

	async run(member) {
		if (member === member.guild.me) return;
		try {
			let embed = new MessageEmbed();
			embed
				.setAuthor(
					member.user.tag,
					member.user.displayAvatarURL({ size: 2048 })
				)
				.setFooter(member.guild.name, member.guild.iconURL({ size: 2048 }))
				.setTimestamp();
			let guild = await this.client.findOrCreateGuild({ id: member.guild.id });
			if (guild.plugins.logs.memberLogs.enabled === true) {
				if (guild.plugins.logs.memberLogs.logs.memberJoin.enabled === false) {
					return;
				} else if (guild.plugins.logs.memberLogs.channel === undefined) {
					return;
				} else {
					let channel = member.guild.channels.get(
						guild.plugins.logs.memberLogs.channel
					);
					if (!channel) {
						return;
					} else {
						let day = new Date(member.joinedAt);
						let created = `${day.getDate()}/${day.getMonth() +
							1}/${day.getFullYear()}`;
						embed
							.setColor(this.client.colors.green)
							.setTitle(this.client.defaults.greenun + '¡Ha salido un usuario!')
							.setDescription('Un usuario se ha salido al servidor')
							.addField('Tag', member.user.tag, true)
							.addField('ID', member.user.id, true)
							.addField(
								'Total de miembros en el servidor',
								member.guild.members.size,
								true
							)
							.addField('Ingreso al servidor', created);
						channel.send({ embed });
					}
				}
			}
		} catch (e) {
			console.log(e);
			this.client.postError({
				type: 'event',
				eventName: 'guildMemberRemove',
				description: e
			});
		}
	}
};
