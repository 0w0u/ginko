const Command = require("../../base/Command.js");

module.exports = class BallCommand extends Command {
    constructor(client) {
        super(client, {
            name: "bola8",
            description: "Pregúntale algo a la bola 8",
            usage: prefix => "`" + prefix + "bola8 <pregunta>`",
            examples: prefix => "`" + prefix + "bola8 ¿Podré ser astronauta?`",
            enabled: true,
            ownerOnly: false,
            guildOnly: false,
            nsfwOnly: false,
            cooldown: 5000,
            aliases: ['8ball'],
            memberPermissions: [],
            botPermissions: [],
            dirname: __dirname
        });
    }

    async run(message, args, data, embed) {
        try {
            let wawa = ['Sí', 'No', '¡Por supuesto!', 'No lo creo...', 'Talvez', 'Muy probablemente', 'Puede que sí', 'No lo sé', 'No tengo idea', 'Probablemente', 'Espero así sea'];
            let uwu = wawa[Math.floor(Math.random() * wawa.length)];
            if (!args[0]) {
                embed
                    .setColor(message.colors.red)
                    .setTitle(message.defaults.noargs)
                    .setDescription('Necesitas preguntar algo');
                return message.channel.send({ embed });
            } else {
                embed
                    .setColor(message.colors.ginko)
                    .setTitle(message.defaults.ginkoun + 'Bola 8')
                    .addField(message.author.username + ' pregunta:', args.join(' '))
                    .addField('Yo respondo:', uwu)
                return message.channel.send({ embed });
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
