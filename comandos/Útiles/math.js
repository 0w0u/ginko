const Command = require('../../base/Command.js'),
  math = require('math-expression-evaluator');

module.exports = class Utils extends Command {
  constructor(client) {
    super(client, {
      name: 'calcular',
      description: 'Calcula una ecuación',
      usage: prefix => '`' + prefix + 'calcular <ecuación>`',
      examples: prefix =>
        '`' +
        prefix +
        'calcular 10 + 56 * 50`, `' +
        prefix +
        'calcular 36 / 15 * 2`',
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      nsfwOnly: false,
      cooldown: 5000,
      aliases: ['calc', 'math'],
      memberPermissions: [],
      botPermissions: [],
      dirname: __dirname
    });
  }
  async run(message, args, data, embed) {
    try {
      if (!args[0]) {
        embed
          .setColor(message.colors.red)
          .setTitle(message.defaults.noargs)
          .setDescription('Necesitas ingresar algo para calcular');
        return message.channel.send({ embed });
      } else {
        try {
          embed
            .setColor(message.colors.ginko)
            .setTitle(message.defaults.ginkoun + 'Calculadora')
            .setDescription(
              'La respuesta a tu ecuación\n```\n' +
                args.join(' ') +
                '```es:```\n' +
                math.eval(args.join(' ')) +
                '```'
            );
          return message.channel.send({ embed });
        } catch {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.error)
            .setDescription('Eso no puede ser calculado');
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
