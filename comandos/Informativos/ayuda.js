const Command = require("../../base/Command.js"),
      { version } = require("../../package.json");

module.exports = class HelpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ayuda",
      description: "Obtén información sobre el bot, o sobre un comando específico, o la lista de comandos",
      usage: prefix => "`" + prefix + "ayuda [comando | lista]`",
      examples: prefix => "`" + prefix + "ayuda eval`, `" + prefix + "ayuda lista`",
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      nsfwOnly: false,
      cooldown: 5000,
      aliases: ["help", "docs", "h"],
      memberPermissions: [],
      botPermissions: [],
      dirname: __dirname
    });
  }

  async run(message, args, data, embed) {
    try {
      let comandos = this.client.commands;
      let aliases = this.client.aliases;
      if (!args[0]) {
        embed
          .setColor(message.colors.ginko)
          .setTitle(message.defaults.ginkoun + '¡Hola! Mi nombre es ' + this.client.user.username)
          .setDescription('Éste es el comando de ayuda, y ésta es información que debes saber sobre mí\nUsa `' + message.dmguildprefix + 'ayuda lista` para ver mi lista de comandos')
          .setThumbnail(message.client.user.displayAvatarURL({ size: 2048 }))
          .addField('¡Advertencias!', 'No uses literalmente `< >`, `[ ]`, ` | ` a la hora de ejecutar un comando,\nestos son representados como; `Argumento obligatorio`, `Argumento opcional` y `Opciones de argumentos` respectivamente')
          .addField('¡Enlaces útiles!', '[`Servidor de soporte   `](' + message.misc.others.support + ')  [`Enlace de invitación   `](' + message.misc.others.invite + ')\n[`Código abierto        `](' + message.misc.others.glitch + ')  [`Patreon                `](' + message.misc.others.donate + ')')
          .setImage('https://media.discordapp.net/attachments/632984081709269015/657037947895545866/ginkobanner.png')
          .setFooter((message.guild ? message.guild.name : this.client.user.username) + ' | Versión: ' + version, (message.guild ? message.guild.iconURL({ size: 2048 }) : this.client.user.displayAvatarURL({ size: 2048 })));
       message.channel.send({ embed });
      } else if (args[0].toLowerCase() === 'lista' || args[0].toLowerCase() === 'comandos') {
        let or = {
          INFORMATIVOS: 10,
          ÚTILES: 11,
          DIVERTIDOS: 18,
          REACCIÓN: 20,
          INTERACCIÓN: 30,
          ADMINISTRATIVOS: 90
        };
        let categorias = [];
        comandos.forEach(command => {
          if (!categorias.includes(command.help.category)) {
            categorias.push(command.help.category);
          }
        });
        let temp = [];
        for (let i = 0; i < categorias.length; i++) { temp.push(null);}
        for (let cat of categorias) { temp[or[cat.toUpperCase()]] = cat;}
        categorias = temp.filter(x => x !== null);
        embed
          .setColor(message.colors.ginko)
          .setTitle(message.defaults.ginkoun + '¡Ésta es mi lista de comandos!')
          .setDescription('Para ver la ayuda de un comando usa `' + message.dmguildprefix + 'ayuda <comando>`')
          .setThumbnail(message.client.user.displayAvatarURL({ size: 2048 }));
        categorias.forEach(cat => {
          let commandsize = comandos.filter(cmd => cmd.help.category === cat);
          embed
            .addField(cat + ' • (' + commandsize.size + ')', '`' + commandsize.map(cmd => cmd.help.name).join('`, `') + '`');
        });
        message.channel.send({ embed });
        return;
      } else {
        if (!comandos.has(args[0].toLowerCase()) && !comandos.has(aliases.get(args[0].toLowerCase()))) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.error)
            .setDescription('Ese comando no es una alias o no existe');
          return message.channel.send({ embed });
        } else {
          let ayuda = this.client.commands.get(args[0].toLowerCase()) || this.client.commands.get(aliases.get(args[0].toLowerCase()));
          embed
            .setColor(message.colors.ginko)
            .setTitle(message.defaults.ginkoun + '`' + ayuda.help.category + '`: ayuda detallada de `' + (ayuda.help.name[0].toUpperCase() + ayuda.help.name.slice(1)) + '`')
            .addField('Descripción', ayuda.help.description !== " " ? ayuda.help.description : 'No se proporcionó una descripción para este comando')
            .addField('Uso', ayuda.help.usage(message.dmguildprefix))
            .addField('Ejemplo(s)', ayuda.help.examples(message.dmguildprefix))
            .addField('Alias(es)', `\`${ayuda.config.aliases.join('`, `')}\``);
          return message.channel.send({ embed });
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
