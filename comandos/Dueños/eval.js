const Command = require("../../base/Command.js"),
  { MessageEmbed, MessageAttachment } = require("discord.js"),
  { exec } = require('child_process');
module.exports = class Owner extends Command {
  constructor(client) {
    super(client, {
      name: "eval",
      description: "Evalúa un código",
      usage: prefix => "`" + prefix + "eval <código>`",
      examples: prefix => "`" + prefix + "eval this.client.ping`",
      enabled: true,
      ownerOnly: true,
      guildOnly: false,
      nsfwOnly: false,
      cooldown: 5000,
      aliases: ["e"],
      memberPermissions: [],
      botPermissions: [],
      dirname: __dirname
    });
  }

  async run(message, args, data, embed) {
    try {
      let author = message.author,
        guild = message.guild,
        channel = message.channel,
        client = message.client,
        duser = await client.findOrCreateUser({ id: message.author.id }),
        dguild;
      message.guild ? (dguild = await client.findOrCreateGuild({ id: message.guild.id })) : ''
      try {
        let evalued = await eval(args.join(" "));
        if (typeof (evalued) !== "string")
          evalued = require("util").inspect(evalued, { depth: 0 });
        if (evalued.length > 1950) {
          message.channel.send("> " + message.defaults.error + " El resultado es muy largo");
        } else if (evalued.includes(client.config.tokens.bot || client.config.tokens.mongo)) {
          message.channel.send("> " + message.defaults.error + " El resultado contiene un token");
        } else {
          message.channel.send("> " + message.defaults.done + "\n```js\n" + evalued + "\n```");
        }
      } catch (err) {
        err = err.toString();
        if (err.includes(client.config.tokens.bot || client.config.tokens.mongo)) err = err.replace((client.config.tokens.bot || client.config.tokens.mongo), "T0K3N");
        message.channel.send("> " + message.defaults.error + "\n```js\n " + err + "\n```");
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