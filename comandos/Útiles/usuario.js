const Command = require('../../base/Command.js'),
  { MessageEmbed } = require('discord.js');
module.exports = class Utils extends Command {
  constructor(client) {
    super(client, {
      name: 'usuario',
      description:
        'Mira tu información o de algún otro usuario del servidor o globalmente con una ID',
      usage: prefix => '`' + prefix + 'usuario [usuario]`',
      examples: prefix =>
        '`' + prefix + 'usuario`, `' + prefix + 'usuario mon`',
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
          return await o(member, this.client);
        } else {
          member = message.mentions.members.first();
          if (member) return await o(member, this.client);
          members = message.guild.members
            .array()
            .filter(m =>
              `${
                m.nickname
                  ? `${m.nickname + m.user.tag}`
                  : `${m.displayName + m.user.tag}`
              }`
                .toLowerCase()
                .includes(args.join(' ').toLowerCase())
            );
          if (members.length < 1) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.error)
              .setDescription(
                'No hay ningún miembro que coincida con tu búsqueda, ¡intenta ser más específico!'
              );
            return message.channel.send({ embed });
          } else if (members.length === 1) {
            return await o(members[0], this.client);
          } else if (members.length >= 10) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.error)
              .setDescription(
                'Muchos usuarios coinciden con tu búsqueda, ¡intenta ser más específico!'
              );
            return message.channel.send({ embed });
          } else {
            let length = members.length > 9 ? 10 : members.length,
              text = 'Selecciona un número entre 1 y ' + length + '```js\n';
            for (let i = 0; i < length; i++) {
              text += `${i + 1} - ${members[i].displayName}: (${
                members[i].user.tag
              }),\n`;
            }
            let textS = text.split(',');
            textS.pop();
            embed
              .setColor(message.colors.gray)
              .setTitle(message.defaults.grayun + 'Esperando respuesta...')
              .setDescription(textS.join(',') + '```');
            let msg = await message.channel.send({ embed });
            let index = await message.channel.awaitMessages(
              m =>
                m.author.id == message.author.id &&
                m.content > 0 &&
                m.content < length + 1,
              {
                max: 1,
                time: 60000,
                errors: ['cancel', 'cancelar']
              }
            );
            if (!index.first()) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.redun + '¡No se recibió respuesta!')
                .setDescription(
                  'Debes seleccionar un número del índice, ¡inténtalo de nuevo!'
                );
              message.channel.send({ embed });
              if (
                message.channel
                  .permissionsFor(this.client.user)
                  .has('MANAGE_MESSAGES')
              )
                message.delete();
              msg.delete();
              return;
            } else {
              if (
                message.channel
                  .permissionsFor(this.client.user)
                  .has('MANAGE_MESSAGES')
              )
                message.delete();
              msg.delete();
              return await o(members[index.first().content - 1], this.client);
            }
          }
        }
        async function o(m, client) {
          let p = m.user.presence.clientStatus;
          let status;
          let onlineE = client.emojis.get('650475659663114260'),
            idleE = client.emojis.get('650475659302273045'),
            dndE = client.emojis.get('650475659704926238'),
            offlineE = client.emojis.get('650475659365187606'),
            onlineME = client.emojis.get('650169275356676125'),
            idleME = client.emojis.get('650169275125858318'),
            dndME = client.emojis.get('650169275478441994');
          if (p && p.desktop === 'online')
            status = onlineE.toString() + ' **Conectado**: en **escritorio**';
          else if (p && p.desktop === 'idle')
            status = idleE.toString() + ' **Ausente**: en **escritorio**';
          else if (p && p.desktop === 'dnd')
            status = dndE.toString() + ' **No molestar**: en **escritorio**';
          else if (p && p.web === 'online')
            status = onlineE.toString() + ' **Conectado**: en **web**';
          else if (p && p.web === 'idle')
            status = idleE.toString() + ' **Ausente**: en **web**';
          else if (p && p.web === 'dnd')
            status = dndE.toString() + ' **No molestar**: en **web**';
          else if (p && p.mobile === 'online')
            status = onlineME.toString() + ' **Conectado**: en **móvil**';
          else if (p && p.mobile === 'idle')
            status = idleME.toString() + ' **Ausente*:* en **móvil**';
          else if (p && p.mobile === 'dnd')
            status = dndME.toString() + ' **No molestar**: en **móvil**';
          else status = offlineE.toString() + ' **Desconectado**';
          let userday = new Date(m.user.createdAt);
          let usercreated = `${userday.getDate()}/${userday.getMonth() +
            1}/${userday.getFullYear()}`;
          let memberday = new Date(m.joinedAt);
          let membercreated = `${memberday.getDate()}/${memberday.getMonth() +
            1}/${memberday.getFullYear()}`;
          let highestRole = m.roles
            .map(x => x)
            .sort((a, b) => b.position - a.position)[0];
          let w = m.user.presence.activity;
          embed
            .setColor(
              highestRole.hexColor === '#000000'
                ? message.colors.ginko
                : highestRole.hexColor
            )
            .setTitle(message.defaults.ginkoun + 'Información de usuario')
            .setDescription(
              'Recuerda que en mi `mensaje directo` puedes buscar un usuario por ID'
            )
            .setThumbnail(m.user.displayAvatarURL({ size: 2048 }))
            .addField(
              'Información general',
              `Nombre: ${
                m.nickname
                  ? `${m.nickname} (${m.user.username})`
                  : `${m.user.username}`
              }\nTag: ${m.user.tag}\nID: ${m.user.id}`
            )
            .addField(
              'Presencia',
              `${status}\nJugando a: ${
                m.user.presence.activity
                  ? `${
                      m.user.presence.activity.name
                        ? m.user.presence.activity.name
                        : '*No está jugando nada*'
                    }`
                  : '*No está jugando nada*'
              }\nEstado personalizado: ${
                w === null || w.state === null
                  ? `*No tiene*`
                  : `${
                      w.emoji === null
                        ? ``
                        : `${
                            w.emoji.id === undefined
                              ? `${w.emoji.name}`
                              : `<${w.emoji.animated ? `a` : ``}:${
                                  w.emoji.name
                                }:${w.emoji.id}>`
                          }`
                    } ${w.state}`
              }`
            )
            .addField(
              'Fechas',
              `Cuenta creada: ${usercreated}\nIngreso al servidor: ${membercreated}`
            )
            .addField(
              'Rol más alto',
              highestRole === '@everyone'
                ? `*No tiene*`
                : `<@&${highestRole.id}>`,
              true
            )
            .addField(
              'Permisos',
              `\`\`\`md\n${m.permissions
                .toArray()
                .map(x => x.split('_').join(' '))
                .join(' | ')}\`\`\``
            );
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
        async function o(u, client) {
          let p = u.presence.clientStatus;
          let status;
          let onlineE = client.emojis.get('650475659663114260'),
            idleE = client.emojis.get('650475659302273045'),
            dndE = client.emojis.get('650475659704926238'),
            offlineE = client.emojis.get('650475659365187606'),
            onlineME = client.emojis.get('650169275356676125'),
            idleME = client.emojis.get('650169275125858318'),
            dndME = client.emojis.get('650169275478441994');
          if (p && p.desktop === 'online')
            status = onlineE.toString() + ' **Conectado**: en **escritorio**';
          else if (p && p.desktop === 'idle')
            status = idleE.toString() + ' **Ausente**: en **escritorio**';
          else if (p && p.desktop === 'dnd')
            status = dndE.toString() + ' **No molestar**: en **escritorio**';
          else if (p && p.web === 'online')
            status = onlineE.toString() + ' **Conectado**: en **web**';
          else if (p && p.web === 'idle')
            status = idleE.toString() + ' **Ausente**: en **web**';
          else if (p && p.web === 'dnd')
            status = dndE.toString() + ' **No molestar**: en **web**';
          else if (p && p.mobile === 'online')
            status = onlineME.toString() + ' **Conectado**: en **móvil**';
          else if (p && p.mobile === 'idle')
            status = idleME.toString() + ' **Ausente*:* en **móvil**';
          else if (p && p.mobile === 'dnd')
            status = dndME.toString() + ' **No molestar**: en **móvil**';
          else status = offlineE.toString() + ' **Desconectado**';
          let userday = new Date(u.createdAt);
          let usercreated = `${userday.getDate()}/${userday.getMonth() +
            1}/${userday.getFullYear()}`;
          let w = u.presence.activity;
          embed
            .setColor(message.colors.ginko)
            .setTitle(message.defaults.ginkoun + 'Información del usuario')
            .setDescription(
              "En `mensaje directo` solo puedes usar ID's como buscador"
            )
            .setThumbnail(u.displayAvatarURL({ size: 2048 }))
            .addField(
              'Información general',
              `Nombre: ${u.username}\nTag: ${u.tag}\nID: ${u.id}`
            )
            .addField(
              'Presencia',
              `${status}\nJugando a: ${
                u.presence.activity
                  ? `${
                      u.presence.activity.name
                        ? u.presence.activity.name
                        : '*No está jugando nada*'
                    }`
                  : '*No está jugando nada*'
              }\nEstado personalizado: ${
                w === null || w.state === null
                  ? `*No tiene*`
                  : `${
                      w.emoji === null
                        ? ``
                        : `${
                            w.emoji.id === undefined
                              ? `${w.emoji.name}`
                              : `<${w.emoji.animated ? `a` : ``}:${
                                  w.emoji.name
                                }:${w.emoji.id}>`
                          }`
                    } ${w.state}`
              }`
            )
            .addField('Fechas', `Cuenta creada: ${usercreated}`);
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
