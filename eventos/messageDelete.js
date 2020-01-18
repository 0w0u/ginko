const { MessageEmbed } = require('discord.js');

module.exports = class MessageDeleteEvent {
  constructor(client) {
    this.client = client;
  }
  async run(message) {
    if (message.author === this.client.user) return;
    try {
      if (message.channel.type === 'dm') return;
      let embed = new MessageEmbed();
      embed
        .setAuthor(message.author.tag, message.author.displayAvatarURL({ size: 2048 }))
        .setFooter(message.guild.name, message.guild.iconURL({ size: 2048 }))
        .setTimestamp();
      let guild = await this.client.findOrCreateGuild({ id: message.guild.id });
      if (guild.plugins.logs.messageLogs.enabled === true) {
        if (guild.plugins.logs.messageLogs.logs.messageDelete.enabled === false) {
          return;
        } else if (guild.plugins.logs.messageLogs.channel === undefined) {
          return;
        } else {
          let channel = message.guild.channels.get(guild.plugins.logs.messageLogs.channel);
          if (!channel) {
            return;
          } else {
            embed
              .setColor(this.client.colors.red)
              .setTitle(this.client.defaults.redun + 'Mensaje borrado')
              .setDescription('Canal: `' + message.channel.name + '`');
            if (message.content) {
              embed.addField('Contenido', message.content);
            }
            if (message.attachments.size > 0) {
              let urls = message.attachments.map(r => `https://media.discordapp.net/attachments/${message.channel.id}/${r.id}/${r.name}`).join('\n');
              embed.addField('Archivos adjuntos', urls);
            }
            channel.send({ embed });
          }
        }
      }
    } catch (e) {
      console.log(e);
      this.client.postError({
        type: 'event',
        eventName: 'messageDelete',
        description: e
      });
    }
  }
};
