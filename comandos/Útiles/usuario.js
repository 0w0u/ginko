const Command = require("../../base/Command.js"),
      { MessageEmbed } = require("discord.js");
module.exports = class AvatarCommand extends Command {
  constructor(client) {
    super(client, {
      name: "usuario",
      description: "Mira tu información o de algún otro usuario del servidor o globalmente con una ID",
      usage: prefix => "`" + prefix + "usuario [usuario]`",
      examples: prefix => "`" + prefix + "usuario`, `" + prefix + "usuario mon`",
      enabled: true,
      ownerOnly: false,
      guildOnly: false,
      nsfwOnly: false,
      cooldown: 5000,
      aliases: ['user'],
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
          return await o(member);
        } else {
          member = message.mentions.members.first();
          if (member) return await o(member);
          members = message.guild.members.array().filter(m => `${m.nickname ? `${m.nickname + m.user.tag}` : `${m.displayName + m.user.tag}`}`.toLowerCase().includes(args.join(" ").toLowerCase()));
          if (members.length < 1) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.error)
              .setDescription("No hay ningún miembro que coincida con tu búsqueda, ¡intenta ser más específico!");
            return message.channel.send({ embed });
          } else if (members.length === 1) {
            return await o(members[0]);
          } else if (members.length >= 10) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.error)
              .setDescription("Muchos usuarios coinciden con tu búsqueda, ¡intenta ser más específico!");
            return message.channel.send({ embed });
          } else {
            let length = members.length > 9 ? 10 : members.length,
              text = "Selecciona un número entre 1 y " + length + "```js\n";
            for (let i = 0; i < length; i++) {
              text += `${i + 1} - ${members[i].displayName}: (${members[i].user.tag}),\n`;
            }
            let textS = text.split(",");
            textS.pop();
            embed
              .setColor(message.colors.gray)
              .setTitle(message.defaults.grayun + "Esperando respuesta...")
              .setDescription(textS.join(",") + "```");
            let msg = await message.channel.send({ embed });
            let index = await message.channel.awaitMessages(m => m.author.id == message.author.id && m.content > 0 && m.content < length + 1, {
                  max: 1,
                  time: 60000,
                  errors: ["cancel", "cancelar"]
                })
            if (!index.first()) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.redun + "¡No se recibió respuesta!")
                .setDescription("Debes seleccionar un número del índice, ¡inténtalo de nuevo!");
              message.channel.send({ embed });
              if (message.channel.permissionsFor(this.client.user).has("MANAGE_MESSAGES")) message.delete();
              msg.delete();
              return;
            } else {
              if (message.channel.permissionsFor(this.client.user).has("MANAGE_MESSAGES")) message.delete();
              msg.delete();
              return await o(members[index.first().content - 1]);
            }
          }
        }
        async function o(m) {
          let p = m.presence.clientStatus;
          let status;
          if (p && p.desktop === 'online') status = '<:au_UserStatusOnline:650475659663114260> **Conectado**: en **escritorio**';
          else if (p && p.desktop === 'idle') status = '<:au_UserStatusIdle:650475659302273045> **Ausente**: en **escritorio**';
          else if (p && p.desktop === 'dnd') status = '<:au_UserStatusDnd:650475659704926238> **No molestar**: en **escritorio**';
          else if (p && p.web === 'online') status = '<:au_UserStatusOnline:650475659663114260> **Conectado**: en **web**';
          else if (p && p.web === 'idle') status = '<:au_UserStatusIdle:650475659302273045> **Ausente**: en **web**';
          else if (p && p.web === 'dnd') status = '<:au_UserStatusDnd:650475659704926238> **No molestar**: en **web**';
          else if (p && p.mobile === 'online') status = '<:au_UserStatusOnlineMobile:650169275356676125> **Conectado**: en **móvil**';
          else if (p && p.mobile === 'idle') status = '<:au_UserStatusIdleMobile:650169275125858318> **Ausente*:* en **móvil**';
          else if (p && p.mobile === 'idle') status = '<:au_UserStatusDndMobile:650169275478441994> **No molestar**: en **móvil**'
          else status = '<:au_UserStatusOffline:650475659365187606> **Desconectado**';
          let userday = new Date(m.user.createdAt);
          let usercreated = `${userday.getDate()}/${userday.getMonth() + 1}/${userday.getFullYear()}`;
          let memberday = new Date(m.joinedAt);
          let membercreated = `${memberday.getDate()}/${memberday.getMonth() + 1}/${memberday.getFullYear()}`;
          let highestRole = m.roles.map(x => x).sort((a, b) => b.position - a.position)[0];
          embed
            .setColor(highestRole.hexColor === "#000000" ? message.colors.ginko : highestRole.hexColor)
            .setTitle(message.defaults.ginkoun + 'Información de usuario')
            .setDescription('Recuerda que en mi `mensaje directo` puedes buscar un usuario por ID')
            .setThumbnail(m.user.displayAvatarURL({ size: 2048 }))
            .addField('Información general', `Nombre: ${m.nickname ? `${m.nickname} (${m.user.username})` : `${m.user.username}`}\nTag: ${m.user.tag}\nID: ${m.user.id}`)
            .addField('Presencia', `${status}\nJugando a: ${m.user.presence.activity ? `${m.user.presence.activity.name ? m.user.presence.activity.name : '*No está jugando nada*'}` : '*No está jugando nada*'}\nEstado personalizado: ${m.user.presence.activity ? `${m.user.presence.activity.state ? `${m.user.presence.activity.emoji ? (m.user.presence.activity.emoji.animated ? `<a:${m.user.presence.activity.emoji.name}:${m.user.presence.activity.emoji.id}>`  : `<:${m.user.presence.activity.emoji.name}:${m.user.presence.activity.emoji.id}>`) : `${m.user.presence.activity.state}`} ` : "*No tiene*"}` : '*No tiene*'}`)
            .addField('Fechas', `Cuenta creada: ${usercreated}\nIngreso al servidor: ${membercreated}`)
            .addField('Rol más alto', highestRole === "@everyone" ? `*No tiene*` : `<@&${highestRole.id}>`, true)
            .addField('Permisos', `\`\`\`md\n${m.permissions.toArray().map(x => x.split("_").join(" ")).join(" | ")}\`\`\``);
          message.channel.send({ embed });
        }
      } else if (message.channel.type === "dm") {
        if (!args[0]) return await o(message.author);
        else {
          if (!isNaN(args[0])) {
            let u = await this.client.users.fetch(args[0]);
            if (u) return await o(u);
            else return await o(message.author);
          } else return await o(message.author);
        }
        async function o(u) {
          let p = u.presence.clientStatus;
          let status;
          if (p && p.desktop === 'online') status = '<:au_UserStatusOnline:650475659663114260> **Conectado**: en **escritorio**';
          else if (p && p.desktop === 'idle') status = '<:au_UserStatusIdle:650475659302273045> **Ausente**: en **escritorio**';
          else if (p && p.desktop === 'dnd') status = '<:au_UserStatusDnd:650475659704926238> **No molestar**: en **escritorio**';
          else if (p && p.web === 'online') status = '<:au_UserStatusOnline:650475659663114260> **Conectado**: en **web**';
          else if (p && p.web === 'idle') status = '<:au_UserStatusIdle:650475659302273045> **Ausente**: en **web**';
          else if (p && p.web === 'dnd') status = '<:au_UserStatusDnd:650475659704926238> **No molestar**: en **web**';
          else if (p && p.mobile === 'online') status = '<:au_UserStatusOnlineMobile:650169275356676125> **Conectado**: en **móvil**';
          else if (p && p.mobile === 'idle') status = '<:au_UserStatusIdleMobile:650169275125858318> **Ausente**: en **móvil**';
          else if (p && p.mobile === 'idle') status = '<:au_UserStatusDndMobile:650169275478441994> **No molestar**: en **móvil**';
          else status = '<:au_UserStatusOffline:650475659365187606> **Desconectado**';
          let userday = new Date(u.createdAt);
          let usercreated = `${userday.getDate()}/${userday.getMonth() + 1}/${userday.getFullYear()}`;
          embed
            .setColor(message.colors.ginko)
            .setTitle(message.defaults.ginkoun + 'Información del usuario')
            .setDescription('En `mensaje directo` solo puedes usar ID\'s como buscador')
            .setThumbnail(u.displayAvatarURL({ size: 2048 }))
            .addField('Información general', `Nombre: ${u.username}\nTag: ${u.tag}\nID: ${u.id}`)
            .addField('Presencia', `${status}\nJugando a: ${u.presence.activity ? `${u.presence.activity.name ? u.presence.activity.name : '*No está jugando nada*'}` : '*No está jugando nada*'}\nEstado personalizado: ${u.presence.activity ? `${u.presence.activity.state ? `${u.presence.activity.emoji ? (u.presence.activity.emoji.animated ? `<a:${u.presence.activity.emoji.name}:${u.presence.activity.emoji.id}>`  : `<:${u.presence.activity.emoji.name}:${u.presence.activity.emoji.id}>`) : `${u.presence.activity.state}`} ` : "*No tiene*"}` : '*No tiene*'}`)
            .addField('Fechas', `Cuenta creada: ${usercreated}`);
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
