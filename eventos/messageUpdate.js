const { MessageEmbed } = require('discord.js');

module.exports = class MessageUpdateEvent {
  constructor(client) {
    this.client = client;
  }
  async run(oldMessage, newMessage) {
    if (oldMessage.author === this.client.user) return;
    if (oldMessage.content === newMessage.content) return;
    if (oldMessage === newMessage) return;
    try {
      this.client.emit('message', newMessage);
      if ((oldMessage || newMessage).channel.type === 'dm') return;
      let embed = new MessageEmbed();
      embed
        .setAuthor(oldMessage.author.tag, oldMessage.author.displayAvatarURL({ size: 2048 }))
        .setFooter(oldMessage.guild.name, oldMessage.guild.iconURL({ size: 2048 }))
        .setTimestamp();
      let guild = await this.client.findOrCreateGuild({
        id: oldMessage.guild.id
      });
      if (guild.plugins.logs.messageLogs.enabled === true) {
        if (guild.plugins.logs.messageLogs.logs.messageUpdate.enabled === false) {
          return;
        } else if (guild.plugins.logs.messageLogs.channel === undefined) {
          return;
        } else {
          let channel = oldMessage.guild.channels.get(guild.plugins.logs.messageLogs.channel);
          if (!channel) {
            return;
          } else {
            embed
              .setColor(this.client.colors.yellow)
              .setTitle(this.client.defaults.yellowun + 'Mensaje editado')
              .setDescription('Canal: `' + oldMessage.channel.name + '`')
              .addField('> Antes: ', oldMessage.content ? oldMessage.content : '*Mensaje vacío*', oldMessage.content.length > 16 ? false : true)
              .addField('> Después: ', newMessage.content ? newMessage.content : '*Mensaje vacío*', newMessage.content.length > 16 ? false : true);
            channel.send({ embed });
          }
        }
      }
    } catch (e) {
      console.log(e);
      this.client.postError({
        type: 'event',
        eventName: 'messageUpdate',
        description: e
      });
    }
  }
};
