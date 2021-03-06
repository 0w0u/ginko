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
      if (message.guild) {
        let member, members;
        if (!args[0]) {
          member = message.member;
          return await o(member, this.client);
        } else {
          member = message.mentions.members.first();
          if (member) return await o(member, this.client);
          else {
            members = message.guild.members.array().filter(m => `${m.nickname ? `${m.nickname + m.user.tag}` : `${m.displayName + m.user.tag}`}`.toLowerCase().includes(args.join(' ').toLowerCase()));
            if (members.length < 1) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.error)
                .setDescription('No hay ningún miembro que coincida con tu búsqueda, ¡intenta ser más específico!');
              return message.channel.send({ embed });
            } else if (members.length === 1) {
              return await o(members[0]);
            } else if (members.length >= 15) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.error)
                .setDescription('Muchos usuarios coinciden con tu búsqueda, ¡intenta ser más específico!');
              return message.channel.send({ embed });
            } else {
              let length = members.length > 14 ? 15 : members.length,
                text = 'Selecciona un número entre 1 y ' + length;
              for (let i = 0; i < length; i++) {
                text += `\`${i + 1}\` ~ ${members[i].displayName} | ${members[i].user.tag}`;
              }
              embed
                .setColor(message.colors.gray)
                .setTitle(message.defaults.grayun + 'Esperando respuesta...')
                .setDescription(text);
              let msg = await message.channel.send({ embed });
              let index = await message.channel.awaitMessages(m => m.author.id == message.author.id && m.content > 0 && m.content < length + 1, {
                max: 1,
                time: 60000,
                errors: ['cancel', 'cancelar']
              });
              await index.first();
              if (!index) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.redun + '¡No se recibió respuesta!')
                  .setDescription('Debes seleccionar un número del índice, ¡inténtalo de nuevo!');
                message.channel.send({ embed });
                return;
              } else {
                return await o(members[index.content - 1], this.client);
              }
            }
          }
        }
        async function o(m, c) {
          embed.setColor(message.colors.ginko).setDescription('Recuerda que en mi `mensaje directo` puedes buscar un usuario por ID');
          message.channel.send({ embed });
        }
      } else if (message.channel.type === 'dm') {
        if (!args[0]) return await o(message.author, this.client);
        else {
          if (!isNaN(args[0])) {
            let u = await this.client.users.fetch(args[0]);
            if (u) return await o(u, this.client);
            else return await o(message.author, this.client);
          } else return await o(message.author, this.client);
        }
        async function o(m, c) {
          embed.setColor(message.colors.ginko).setDescription("En `mensaje directo` solo puedes usar ID's como buscador");
          message.channel.send({ embed });
        }
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
