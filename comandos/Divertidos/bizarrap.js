const Command = require('../../base/Command.js');

module.exports = class Fun extends Command {
  constructor(client) {
    super(client, {
      name: 'bizarrap',
      description: 'Conviértete en un BZRP Music session',
      usage: prefix => '`' + prefix + 'bizarrap <usuario | texto> | <número> | [lado]`',
      examples: prefix => '`' + prefix + 'bizarrap Wos/22`, `' + prefix + 'bizarrap Kinder Malo/22/C`',
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      nsfwOnly: false,
      cooldown: 5000,
      aliases: ['bzrp'],
      memberPermissions: [],
      botPermissions: [],
      dirname: __dirname
    });
  }

  async run(message, args, data, embed) {
    try {
      let argu = args
        .join(' ')
        .split('|')
        .map(arg => arg.trim());
      if (!argu[0]) {
        embed
          .setColor(message.colors.red)
          .setTitle(message.defaults.noargs)
          .setDescription('Necesitas escribir algo o mencionar a alguien');
        return message.channel.send({ embed });
      } else {
        if (!argu[1]) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.noargs)
            .setDescription('Necesitas seleccionar un número de sesión');
          return message.channel.send({ embed });
        } else if (isNaN(argu[1])) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.error)
            .setDescription('La sesión necesita ser un número');
          return message.channel.send({ embed });
        } else {
          embed
            .setColor(message.colors.ginko)
            .setTitle(message.defaults.ginkoun + 'Bizarrap Music Sessions')
            .setDescription(message.author.username + ' aquí está tu music session\n```\n' + (message.mentions.users.first() ? message.mentions.users.first().username.toUpperCase() : argu[0].toUpperCase()) + ' || BZRP Music Sessions #' + argu[1] + (argu[2] ? ` || LADO ${argu[2][0].toUpperCase()}` : '') + '\n```');
          return message.channel.send({ embed });
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
