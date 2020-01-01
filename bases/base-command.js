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
