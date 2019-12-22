const { MessageEmbed } = require("discord.js");

module.exports = class MessageDeleteBulkEvent {
  constructor(client) {
    this.client = client;
  }

  async run(messages) {
    try {
      if (messages.first().channel.type === 'dm') return;
      setTimeout(async () => {
        let entries = (await messages.first().channel.guild.fetchAuditLogs({ type: 'MESSAGE_BULK_DELETE' })).entries.array().sort((a, b) => b.createdAt - a.createdAt)[0];
        let embed = new MessageEmbed();
        embed
          .setAuthor(entries.executor.tag, entries.executor.displayAvatarURL({ size: 2048 }))
          .setFooter(messages.first().channel.guild.name, messages.first().channel.guild.iconURL({ size: 2048 }))
          .setTimestamp();
        let guild = await this.client.findOrCreateGuild({ id: messages.first().channel.guild.id });
        if (guild.plugins.logs.messageLogs.enabled === true) {
          if (guild.plugins.logs.messageLogs.logs.messageDelete.enabled === false) {
            return;
          } else if (guild.plugins.logs.messageLogs.channel === undefined) {
            return;
          } else {
            let channel = messages.first().channel.guild.channels.get(guild.plugins.logs.messageLogs.channel);
            if (!channel) {
              return;
            } else {
              embed
                .setColor(this.client.colors.red)
                .setTitle(this.client.defaults.redun + 'Mensajes borrados en masa')
                .setDescription('Canal: `' + messages.first().channel.name + '`')
                .addField('Primeros 5 mensajes', messages.map(m => m.content).slice(0, 5).join('\n') + '\nY otros mensajes...');
              channel.send({ embed });
            }
          }
        }
      }, 1500);
    } catch (e) {
      console.log(e);
      this.client.postError({
        type: "event",
        eventName: "messageDeleteBulk",
        description: e
      });
    }
  }
};