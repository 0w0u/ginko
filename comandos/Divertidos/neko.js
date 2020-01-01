const Command = require('../../base/Command.js');

module.exports = class Fun extends Command {
  constructor(client) {
    super(client, {
      name: 'neko',
      description: '¡Chicas gato! ฅ(＾・ω・＾ฅ)',
      usage: prefix => '`' + prefix + 'neko [imagen | gif]`',
      examples: prefix => '`' + prefix + 'neko gif`',
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      nsfwOnly: false,
      cooldown: 5000,
      aliases: ['nyan'],
      memberPermissions: [],
      botPermissions: [],
      dirname: __dirname
    });
  }

  async run(message, args, data, embed) {
    try {
      let nekoKao = [
          '（＾・ω・＾❁',
          '(=｀ω´=)',
          '(=^･ω･^=)',
          '(=^･ｪ･^=))ﾉ彡☆',
          '（=´∇｀=）'
        ],
        ranKao = nekoKao[Math.floor(Math.random() * nekoKao.length)],
        nekoSel = ['neko', 'nekogif', 'neko', 'nekogif'],
        ranSel = nekoSel[Math.floor(Math.random() * nekoSel.length)],
        img;
      if (!args[0]) {
        ranSel === 'neko'
          ? (img = await this.client.tools.sfw.neko())
          : (img = await this.client.tools.sfw.nekoGif());
      } else if (args[0].toLowerCase() === 'gif') {
        img = await this.client.tools.sfw.nekoGif();
      } else if (args[0].toLowerCase() === 'imagen') {
        img = await this.client.tools.sfw.neko();
      } else {
        ranSel === 'neko'
          ? (img = await this.client.tools.sfw.neko())
          : (img = await this.client.tools.sfw.nekoGif());
      }
      embed
        .setColor(this.client.colors.ginko)
        .setTitle(ranKao)
        .setDescription('Toma tu Neko random')
        .setImage(img.url);
      message.channel.send({ embed });
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
