const { MessageEmbed } = require('discord.js');

module.exports = class GuildMemberAddEvent {
  constructor(client) {
    this.client = client;
  }
  async run(member) {
    if (member === member.guild.me) return;
    try {
      let embed = new MessageEmbed();
      embed
        .setAuthor(member.user.tag, member.user.displayAvatarURL({ size: 2048 }))
        .setFooter(member.guild.name, member.guild.iconURL({ size: 2048 }))
        .setTimestamp();
      let guild = await this.client.findOrCreateGuild({ id: member.guild.id });
      if (guild.plugins.autoRoles.roles >= 1) {
        if (!member.guild.me.permissions.has('MANAGE_ROLES')) {
          return;
        } else if (member.roles.highest.comparePositionTo(member.guild.me.roles.highest) > 0) {
          return;
        } else {
          member.roles.add(guild.plugins.autoRoles.roles);
        }
      }
      if (guild.plugins.logs.memberLogs.enabled === true) {
        if (guild.plugins.logs.memberLogs.logs.memberJoin.enabled === false) {
          return;
        } else if (guild.plugins.logs.memberLogs.channel === undefined) {
          return;
        } else {
          let channel = member.guild.channels.get(guild.plugins.logs.memberLogs.channel);
          if (!channel) {
            return;
          } else {
            let day = new Date(member.user.createdAt);
            let created = `${day.getDate()}/${day.getMonth() + 1}/${day.getFullYear()}`;
            embed
              .setColor(this.client.colors.green)
              .setTitle(this.client.defaults.greenun + '¡Ha entrado un usuario!')
              .setDescription('Un usuario se ha unido al servidor')
              .addField('Tag', member.user.tag, true)
              .addField('ID', member.user.id, true)
              .addField('Miembro número', member.guild.members.size, true)
              .addField('Cuenta creada', created);
            channel.send({ embed });
          }
        }
      }
    } catch (e) {
      console.log(e);
      this.client.postError({
        type: 'event',
        eventName: 'guildMemberAdd',
        description: e
      });
    }
  }
};
