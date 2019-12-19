const Command = require("../../base/Command.js");

module.exports = class FlipCommand extends Command {
  constructor(client) {
    super(client, {
      name: "moneda",
      description: "Tira una moneda. Puede salir cara, o cruz.",
      usage: prefix => "`" + prefix + "moneda [cara | cruz]`",
      examples: prefix => "`" + prefix + "moneda`, `" + prefix + "moneda cara`",
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      nsfwOnly: false,
      cooldown: 5000,
      aliases: ["flip"],
      memberPermissions: [],
      botPermissions: [],
      dirname: __dirname
    });
  }

  async run(message, args, data, embed) {
    try {
      let value = Math.floor(Math.random() * (2 - 1 + 1)) + 1;
      let resultado;
      if (!args[0]) {
        if (value === 1) {
          resultado = 'cara';
        } else {
          resultado = 'cruz';
        }
        embed
          .setColor(message.colors.ginko)
          .setTitle(message.defaults.ginkoun + '¡Resultado!')
          .setDescription('Ha salido **' + resultado + '**');
        message.channel.send({ embed });
      } else if (args[0].toLowerCase() === "cara") {
        if (value === 1) {
          embed
            .setColor(message.colors.green)
            .setTitle(message.defaults.greenun + '¡Cara!')
            .setDescription('¡Has adivinado!');
          message.channel.send({ embed });
        } else if (value === 2) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.redun + 'Cruz')
            .setDescription('Lo siento, ha salido cruz');
          message.channel.send({ embed });
        }
      } else if (args[0].toLowerCase() === 'cruz') {
        if (value === 1) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.redun + 'Cara')
            .setDescription("Lo siento, ha salido cara.");
          message.channel.send({ embed });
        } else if (value === 2) {
          embed
            .setColor(message.colors.green)
            .setTitle(message.defaults.greenun + '¡Cruz!')
            .setDescription('¡Has adivinado!');
          message.channel.send({ embed });
        }
      }
    } catch (e) {
      console.error(e);
      this.client.postError({
        type: "command",
        message: message,
        commandName: this.help.name,
        description: e
      });
    }
  }
};