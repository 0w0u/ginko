const Command = require("../../base/Command.js"),
      { MessageEmbed } = require('discord.js');

module.exports = class OptionsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "opciones",
      description: "Cambia las opciones del servidor",
      usage: prefix => "`" + prefix + "opciones <opción> <primer valor> [<segundo o más valores>]`",
      examples: prefix => "`" + prefix + "opciones prefijo uwu!`, `" + prefix + "opciones sugerencias mensaje md ¡Muchas gracias por tu sugerencia!`",
      enabled: true,
      ownerOnly: false,
      guildOnly: true,
      nsfwOnly: false,
      cooldown: 5000,
      aliases: [],
      memberPermissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
      botPermissions: [],
      dirname: __dirname
    });
  }

  async run(message, args, data, embed) {
    try {
      let options = ['sugerencias', 'registros', 'prefijo', 'auto-roles'],
          optionsJoin = options.join('`, `');
      let guild = data.guild;
      if (!args[0]) {
        embed
          .setColor(message.colors.red)
          .setTitle(message.defaults.noargs)
          .setDescription('Necesitas elegir una opción\nOpciones:\n`' + optionsJoin + '`')
          .addField('Uso', '`' + message.dmguildprefix + 'opciones <opción> <primer valor> [<segundo o más valores>]`');
        message.channel.send({ embed });
        return;
      } else if (args[0].toLowerCase() === options[0]) {
        let options = ['habilitar', 'deshabilitar', 'mensaje'],
            optionsJoin = options.join('`, `')
        if (!args[1]) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.noargs)
            .setDescription('Necesitas elegir una opción\nOpciones:\n`' + optionsJoin + '`');
          message.channel.send({ embed });
          return;
        } else if (args[1].toLowerCase() === options[0]) {
            let channel, channels;
            if (!args[2]) {
              if (guild.plugins.suggestions.channel !== undefined) {
                embed
                  .setColor(message.colors.green)
                  .setTitle(message.defaults.done)
                  .setDescription("Las sugerencias se han habilitado correctamente");
                message.channel.send({ embed });
                guild.plugins.suggestions.enabled = true;
                guild.save();
                return;
              } else {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Necesitas mencionar un canal");
                message.channel.send({ embed });
                return;
              }
            } else {
              channel = message.mentions.channels.first();
              if (channel) return await o(channel);
              else
              channels = message.guild.channels.array().filter(m => m.type !== 'voice' && `${m.name}`.toLowerCase().includes(args.slice(2).join(" ").toLowerCase()));
              if (channels.length < 1) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("No hay ningún canal que coincida con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else if (channels.length === 1) {
                return await o(channels[0]);
              } else if (channels.length >= 10) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Muchos canales coinciden con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else {
                let length = channels.length > 9 ? 10 : channels.length,
                  text = "Selecciona un número entre 1 y " + length + "```js\n";
                for (let i = 0; i < length; i++) {
                  text += `${i + 1} - ${channels[i].name},\n`;
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
                  });
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
                  return await o(channels[index.first().content - 1]);
                }
              }
            }
            async function o(wa) {
              embed
                .setColor(message.colors.green)
                .setTitle(message.defaults.done)
                .setDescription('Las sugerencias se han habilitado correctamente en `#' + wa.name + '`');
              message.channel.send({ embed });
              guild.plugins.suggestions.enabled = true;
              guild.plugins.suggestions.channel = wa.id;
              guild.save();
            }
        } else if (args[1].toLowerCase() === options[1]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done)
              .setDescription('Los registros se han deshabilitado correctamente');
            message.channel.send({ embed });
            guild.plugins.suggestions.enabled = false;
            guild.save();
            return;
        } else if (args[1].toLowerCase() === options[2]) {
          let options = ['md', 'canal'],
              optionsJoin = options.join('`, `');
          if (!args[2]) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.noargs)
              .setDescription('Necesitas elegir una opción\nOpciones:\n`' + optionsJoin +'`');
            message.channel.send({ embed });
            return;
          } else if (args[2].toLowerCase() === options[0]) {
            if (!args[3]) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.noargs)
                .setDescription('Necesitas escribir el mensaje que se enviará' + (guild.plugins.suggestions.options.reply.dm.enabled.default ? '\nSi quieres desactivar los mensajes puedes escribir `' + guild.prefix + 'opciones sugerencias mensaje md cambiar`' : null) + "\nVariables colocables dentro de la respuesta\n>>> " + "`{servidor:nombre}` • Coloca el nombre del servidor\n" + "`{servidor:id}` • Coloca la ID del servidor\n" + "`{autor:nombre}` • Coloca el nombre del autor de la sugerencia\n" + "`{autor:mencion}` • Coloca una mención al autor de la sugerencia\n" + "`{autor:tag}` • Coloca el tag del autor de la sugerencia, ej; `mon#0010`\n" + "`{autor:id}` • Coloca la ID del autor de la sugerencia")
              message.channel.send({ embed });
              return;
            } else if (args[3].toLowerCase() === 'cambiar') {
              let sugg = guild.plugins.suggestions.options.reply.dm;
              embed
                .setColor(message.colors.green)
                .setTitle(message.defaults.done);
              if (sugg.enabled) {
                embed.setDescription('Los mensajes se han deshabilitado correctamente');
                message.channel.send({ embed });
                sugg.enabled = false;
                guild.save();
                return;
              } else {
                embed.setDescription('Los mensajes se han habilitado correctamente');
                message.channel.send({ embed });
                sugg.enabled = true;
                guild.save();
                return;
              }
            } else {
              let sugg = args.slice(3).join(' ');
              embed
                .setColor(message.colors.green)
                .setTitle(message.defaults.done)
                .setDescription('El mensaje que se enviará se ha establecido a: `' + sugg + '`')
              message.channel.send({ embed });
              guild.plugins.suggestions.options.reply.dm = sugg;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[1]) {
            if (!args[3]) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.noargs)
                .setDescription('Necesitas escribir el mensaje que se enviará' + (guild.plugins.suggestions.options.reply.channel.enabled ? '\nSi quieres desactivar los mensajes puedes escribir `' + guild.prefix + 'opciones sugerencias mensaje canal cambiar`' : null) + "\nVariables colocables dentro de la respuesta\n>>> " + "`{servidor:nombre}` • Coloca el nombre del servidor\n" + "`{servidor:id}` • Coloca la ID del servidor\n" + "`{autor:nombre}` • Coloca el nombre del autor de la sugerencia\n" + "`{autor:mencion}` • Coloca una mención al autor de la sugerencia\n" + "`{autor:tag}` • Coloca el tag del autor de la sugerencia, ej; `mon#0010`\n" + "`{autor:id}` • Coloca la ID del autor de la sugerencia")
              message.channel.send({ embed });
              return;
            } else if (args[3].toLowerCase() === 'cambiar') {
              let sugg = guild.plugins.suggestions.options.reply.channel;
              embed
                .setColor(message.colors.green)
                .setTitle(message.defaults.done);
              if (sugg.enabled) {
                embed.setDescription('Los mensajes se han deshabilitado correctamente');
                message.channel.send({ embed });
                sugg.enabled = false;
                guild.save();
                return;
              } else {
                embed.setDescription('Los mensajes se han habilitado correctamente');
                message.channel.send({ embed });
                sugg.enabled = true;
                guild.save();
                return;
              }
            } else {
              let sugg = args.slice(3).join(' ');
              embed
                .setColor(message.colors.green)
                .setTitle(message.defaults.done)
                .setDescription('El mensaje que se enviará se ha establecido a: `' + sugg + '`')
              message.channel.send({ embed });
              guild.plugins.suggestions.options.reply.channel = sugg;
              guild.save();
              return;
            }
          } else {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.error)
              .setDescription('Esa no es una opción válida, las opciones válidas son:\n`' + optionsJoin + '`')
            message.channel.send({ embed });
            return;
          }
        } else {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.error)
            .setDescription('Esa no es una opción válida, las opciones válidas son:\n`' + optionsJoin + '`');
          message.channel.send({ embed });
          return;
        }
      } else if (args[0].toLowerCase() === options[1]) {
        let categories = ['mensajes', 'servidor', 'miembros'],
            categoriesJoin = categories.join('`, `');
        if (!args[1]) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.noargs)
            .setDescription('Necesitas elegir una opción\nOpciones:\n`' + categoriesJoin + '`');
          message.channel.send({ embed });
          return;
        } else if (args[1].toLowerCase() === categories[0]) {
          let options = ['habilitar', 'deshabilitar', 'mensajes-editados', 'mensajes-borrados'],
              optionsJoin = options.join('`, `');
          if (!args[2]) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.noargs)
              .setDescription('Necesitas elegir una opción\nOpciones:\n`' + optionsJoin + '`');
            message.channel.send({ embed });
            return;
          } else if (args[2].toLowerCase() === options[0]) {
            let channel, channels;
            if (!args[3]) {
              if (guild.plugins.logs.messageLogs.channel !== undefined) {
                embed
                  .setColor(message.colors.green)
                  .setTitle(message.defaults.done)
                  .setDescription("Las sugerencias se han habilitado correctamente");
                message.channel.send({ embed });
                guild.plugins.logs.messageLogs.enabled = true;
                guild.save();
                return;
              } else {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Necesitas mencionar un canal");
                message.channel.send({ embed });
                return;
              }
            } else {
              channel = message.mentions.channels.first();
              if (channel) return await o(channel);
              else
              channels = message.guild.channels.array().filter(m => `${m.name}`.toLowerCase().includes(args.slice(3).join(" ").toLowerCase()));
              if (channels.length < 1) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("No hay ningún canal que coincida con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else if (channels.length === 1) {
                return await o(channels[0]);
              } else if (channels.length >= 10) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Muchos canales coinciden con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else {
                let length = channels.length > 9 ? 10 : channels.length,
                  text = "Selecciona un número entre 1 y " + length + "```js\n";
                for (let i = 0; i < length; i++) {
                  text += `${i + 1} - ${channels[i].name},\n`;
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
                  });
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
                  return await o(channels[index.first().content - 1]);
                }
              }
            }
            async function o(m) {
              
              embed
                .setColor(message.colors.green)
                .setTitle(message.defaults.done)
                .setDescription('Las sugerencias se han habilitado correctamente en `#' + m.name + '`');
              message.channel.send({ embed });
              guild.plugins.logs.messageLogs.enabled = true;
              guild.plugins.logs.messageLogs.channel = m.id;
              guild.save();
            }
          } else if (args[2].toLowerCase() === options[1]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done)
              .setDescription('Los registros se han deshabilitado correctamente');
            message.channel.send({ embed });
            guild.plugins.logs.messageLogs.enabled = false;
            guild.save();
            return;
          } else if (args[2].toLowerCase() === options[2]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.messageLogs.logs.messageUpdate.enabled) {
              embed.setDescription('Los registros de `' + (options[2].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.messageLogs.logs.messageUpdate.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros de `' + (options[2].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.messageLogs.logs.messageUpdate.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[3]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.messageLogs.logs.messageDelete.enabled) {
              embed.setDescription('Los registros de `' + (options[3].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.messageLogs.logs.messageDelete.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros de `' + (options[3].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.messageLogs.logs.messageDelete.enabled = true;
              guild.save();
              return;
            }
          } else {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.error)
              .setDescription('Esa no es una opción válida, las opciones válidas son:\n`' + optionsJoin + '`');
            message.channel.send({ embed });
            return;
          }
        } else if (args[1].toLowerCase() === categories[1]) {
          let options = ['habilitar', 'deshabilitar', 'canal-creado', 'canal-actualizado', 'canal-eliminado', 'rol-creado', 'rol-actualizado', 'rol-eliminado', 'servidor-actualizado', 'emojis'],
              optionsJoin = options.join('`, `');
          if (!args[2]) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.noargs)
              .setDescription('Necesitas elegir una opción\nOpciones:\n`' + optionsJoin + '`')
              .addField('Uso', '`' + message.dmguildprefix + 'opciones registros servidor <<habilitar | deshabilitar>|<canal-creado | canal-actualizado | canal-eliminado | rol-creado | rol-actualizado | rol-eliminado | servidor-actualizado | emojis>> [#canal]`');
            message.channel.send({ embed });
            return;
          } else if (args[2].toLowerCase() === options[0]) {
            let channel, channels;
            if (!args[3]) {
              if (guild.plugins.logs.serverLogs.channel !== undefined) {
                embed
                  .setColor(message.colors.green)
                  .setTitle(message.defaults.done)
                  .setDescription("Las sugerencias se han habilitado correctamente");
                message.channel.send({ embed });
                guild.plugins.logs.serverLogs.enabled = true;
                guild.save();
                return;
              } else {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Necesitas mencionar un canal");
                message.channel.send({ embed });
                return;
              }
            } else {
              channel = message.mentions.channels.first();
              if (channel) return await o(channel);
              else
              channels = message.guild.channels.array().filter(m => `${m.name}`.toLowerCase().includes(args.slice(3).join(" ").toLowerCase()));
              if (channels.length < 1) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("No hay ningún canal que coincida con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else if (channels.length === 1) {
                return await o(channels[0]);
              } else if (channels.length >= 10) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Muchos canales coinciden con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else {
                let length = channels.length > 9 ? 10 : channels.length,
                  text = "Selecciona un número entre 1 y " + length + "```js\n";
                for (let i = 0; i < length; i++) {
                  text += `${i + 1} - ${channels[i].name},\n`;
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
                  });
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
                  return await o(channels[index.first().content - 1]);
                }
              }
            }
            async function o(m) {
                embed
                  .setColor(message.colors.green)
                  .setTitle(message.defaults.done)
                  .setDescription('Las sugerencias se han habilitado correctamente en `#' + m.name + '`');
                message.channel.send({ embed });
                guild.plugins.logs.serverLogs.enabled = true;
                guild.plugins.logs.serverLogs.channel = m.id;
                guild.save();
            }
          } else if (args[2].toLowerCase() === options[1]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done)
              .setDescription('Los registros se han deshabilitado correctamente');
            message.channel.send({ embed });
            guild.plugins.logs.serverLogs.enabled = false;
            guild.save();
            return;
          } else if (args[2].toLowerCase() === options[2]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.serverLogs.logs.channelCreate.enabled) {
              embed.setDescription('Los registros de `' + (options[2].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.channelCreate.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros de `' + (options[2].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.channelCreate.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[3]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.serverLogs.logs.channelUpdate.enabled) {
              embed.setDescription('Los registros de `' + (options[3].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.channelUpdate.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros de `' + (options[3].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.channelUpdate.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[4]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.serverLogs.logs.channelDelete.enabled) {
              embed.setDescription('Los registros de `' + (options[4].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.channelDelete.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros de `' + (options[4].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.channelDelete.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[5]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.serverLogs.logs.roleCreate.enabled) {
              embed.setDescription('Los registros de `' + (options[5].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.roleCreate.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + (options[5].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.roleCreate.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[6]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.serverLogs.logs.roleUpdate.enabled) {
              embed.setDescription('Los registros de `' + (options[6].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.roleUpdate.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros de `' + (options[6].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.roleUpdate.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[7]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.serverLogs.logs.roleDelete.enabled) {
              embed.setDescription('Los registros `' + (options[7].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.roleDelete.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + (options[7].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.roleDelete.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[8]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.serverLogs.logs.serverUpdate.enabled) {
              embed.setDescription('Los registros `' + (options[8].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.serverUpdate.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + (options[8].replace(/-/g, ' ')) + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.serverUpdate.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[9]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.serverLogs.logs.emojisChanges.enabled) {
              embed.setDescription('Los registros `' + options[9] + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.emojisChanges.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + options[9] + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.serverLogs.logs.emojisChanges.enabled = true;
              guild.save();
              return;
            }
          } else {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.error)
              .setDescription('Esa no es una opción válida, las opciones válidas son:\n`' + optionsJoin + '`');
            message.channel.send({ embed });
            return;
          }
        } else if (args[1].toLowerCase() === categories[2]) {
          let options = ['habilitar', 'deshabilitar', 'roles', 'nombre', 'avatar', 'veto', 'veto-removido', 'entrada', 'salida'],
              optionsJoin = options.join('`, `');
          if (!args[2]) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.noargs)
              .setDescription('Necesitas elegir una opción\nOpciones:\n`' + optionsJoin + '`')
              .addField('Uso', '`' + message.dmguildprefix + 'opciones registros miembros <<habilitar | deshabilitar>|<roles | nombre | avatar | veto | veto-removido>> [#canal]`');
            message.channel.send({ embed });
            return;
          } else if (args[2].toLowerCase() === options[0]) {
            let channel, channels;
            if (!args[3]) {
              if (guild.plugins.logs.memberLogs.channel !== undefined) {
                embed
                  .setColor(message.colors.green)
                  .setTitle(message.defaults.done)
                  .setDescription("Las sugerencias se han habilitado correctamente");
                message.channel.send({ embed });
                guild.plugins.logs.memberLogs.enabled = true;
                guild.save();
                return;
              } else {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Necesitas mencionar un canal");
                message.channel.send({ embed });
                return;
              }
            } else {
              channel = message.mentions.channels.first();
              if (channel) return await o(channel);
              else
              channels = message.guild.channels.array().filter(m => `${m.name}`.toLowerCase().includes(args.slice(3).join(" ").toLowerCase()));
              if (channels.length < 1) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("No hay ningún canal que coincida con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else if (channels.length === 1) {
                return await o(channels[0]);
              } else if (channels.length >= 10) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Muchos canales coinciden con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else {
                let length = channels.length > 9 ? 10 : channels.length,
                  text = "Selecciona un número entre 1 y " + length + "```js\n";
                for (let i = 0; i < length; i++) {
                  text += `${i + 1} - ${channels[i].name},\n`;
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
                  });
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
                  return await o(channels[index.first().content - 1]);
                }
              }
            }
            async function o(m) {
                embed
                  .setColor(message.colors.green)
                  .setTitle(message.defaults.done)
                  .setDescription('Las sugerencias se han habilitado correctamente en `#' + m.name + '`');
                message.channel.send({ embed });
                guild.plugins.logs.memberLogs.enabled = true;
                guild.plugins.logs.memberLogs.channel = m.id;
                guild.save();
            }
          } else if (args[2].toLowerCase() === options[1]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done)
              .setDescription('Los registros se han deshabilitado correctamente');
            message.channel.send({ embed });
            guild.plugins.logs.memberLogs.enabled = false;
            guild.save();
            return;
          } else if (args[2].toLowerCase() === options[2]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.memberLogs.logs.roleUpdate.enabled) {
              embed.setDescription('Los registros `' + options[3] + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.roleUpdate.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + options[3] + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.roleUpdate.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[3]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.memberLogs.logs.nameChange.enabled) {
              embed.setDescription('Los registros `' + options[3] + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.nameChange.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + options[3] + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.nameChange.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[4]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.memberLogs.logs.avatarChange.enabled) {
              embed.setDescription('Los registros `' + options[4] + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.avatarChange.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + options[4] + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.avatarChange.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[5]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.memberLogs.logs.memberBan.enabled) {
              embed.setDescription('Los registros `' + options[5] + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.memberBan.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + options[5] + '` se han habilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.memberBan.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[6]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.memberLogs.logs.memberUnban.enabled) {
              embed.setDescription('Los registros `' + (options[6].replace(/-/g, ' ')) + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.memberUnban.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + (options[6].replace(/-/g, ' ')) + '` se han habiltado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.memberUnban.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[7]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.memberLogs.logs.memberJoin.enabled) {
              embed.setDescription('Los registros `' + options[7] + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.memberJoin.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + options[7] + '` se han habiltado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.memberJoin.enabled = true;
              guild.save();
              return;
            }
          } else if (args[2].toLowerCase() === options[8]) {
            embed
              .setColor(message.colors.green)
              .setTitle(message.defaults.done);
            if (guild.plugins.logs.memberLogs.logs.memberLeave.enabled) {
              embed.setDescription('Los registros `' + options[7] + '` se han deshabilitado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.memberLeave.enabled = false;
              guild.save();
              return;
            } else {
              embed.setDescription('Los registros `' + options[7] + '` se han habiltado correctamente');
              message.channel.send({ embed });
              guild.plugins.logs.memberLogs.logs.memberLeave.enabled = true;
              guild.save();
              return;
            }
          } else {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.error)
              .setDescription('Esa no es una opción válida, las opciones válidas son:\n`' + optionsJoin + '`');
            message.channel.send({ embed });
            return;
          }
        } else {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.error)
            .setDescription('Esa no es una opción válida, las opciones válidas son:\n`' + categoriesJoin + '`');
          message.channel.send({ embed });
          return;
        }
      } else if (args[0].toLowerCase() === options[2]) {
        if (!args[1]) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.noargs)
            .setDescription('Necesitas especificar el nuevo prefijo')
            .addField('Uso', '`' + message.dmguildprefix + 'opciones prefijo <nuevo prefijo>`');
          message.channel.send({ embed });
          return;
        } else {
          embed
            .setColor(message.colors.green)
            .setTitle(message.defaults.done)
            .setDescription('El prefijo de este servidor se ha cambiado a `' + args[1] + '`\nPuedes ver la ayuda utilizando `' + args[1] + 'ayuda`');
          message.channel.send({ embed });
          guild.prefix = args[1];
          guild.save();
          return;
        }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      } else if (args[0].toLowerCase() === options[3]) {
        let dataroles = data.guild.plugins.autoRoles.roles,
            options = ['agregar', 'remover', 'lista'],
            optionsJoin = options.join('`, `');
        if (!args[1]) {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.noargs)
            .setDescription('Necesitas elegir una opción\nOpciones:\n`' + optionsJoin + '`');
          message.channel.send({ embed });
          return;
        } else if (args[1].toLowerCase() === options[0]) {
          let role, roles;
          if (!args[2]) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.noargs)
              .setDescription('Debes mencionar un rol');
            return message.channel.send({ embed });
          } else {
            role = message.mentions.roles.first();
            if (role) return await o(role);
            else {
              roles = message.guild.roles.array().filter(m => `${m.name}`.toLowerCase().includes(args.slice(2).join(" ").toLowerCase()));
              if (roles.length < 1) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("No hay ningún rol que coincida con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else if (roles.length === 1) {
                return await o(roles[0]);
              } else if (roles.length >= 10) {
                embed
                  .setColor(message.colors.red)
                  .setTitle(message.defaults.error)
                  .setDescription("Muchos roles coinciden con tu búsqueda, ¡intenta ser más específico!");
                return message.channel.send({ embed });
              } else {
                let length = roles.length > 9 ? 10 : roles.length,
                  text = "Selecciona un número entre 1 y " + length + "```js\n";
                for (let i = 0; i < length; i++) {
                text += `${i + 1} - ${roles[i].name},\n`;
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
                  });
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
                  return await o(roles[index.first().content - 1]);
                }
              }
            }
          }
          async function o(m) {
            if (dataroles.includes(m.id)) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.error)
                .setDescription("Ese rol ya está entre los auto-roles")
              return message.channel.send({ embed });
            } else if (dataroles.length === 15) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.error)
                .setDescription("El máximo de auto-roles son 15");
              return message.channel.send({ embed });
            } else {
              embed
                .setColor(message.colors.green)
                .setTitle(message.defaults.done)
                .setDescription("Ahora el rol `" + m.name + "` se le entregará a los usuarios que ingresen al servidor");
              message.channel.send({ embed });
              dataroles.push(m.id);
              data.guild.save();
              return;
            }
          }
        } else if (args[1].toLowerCase() === options[1]) {
          let role, roles;
          if (!args[2]) {
            embed
              .setColor(message.colors.red)
              .setTitle(message.defaults.noargs)
              .setDescription('Debes mencionar un rol');
            return message.channel.send({ embed });
          } else {
            role = message.mentions.roles.first();
            return await o(role)
            roles = message.guild.roles.array().filter(m => `${m.name}`.toLowerCase().includes(args.slice(2).join(" ").toLowerCase()));
            if (roles.length < 1) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.error)
                .setDescription("No hay ningún rol que coincida con tu búsqueda, ¡intenta ser más específico!");
              return message.channel.send({ embed });
            } else if (roles.length === 1) {
              return await o(roles[0]);
            } else if (roles.length >= 10) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.error)
                .setDescription("Muchos roles coinciden con tu búsqueda, ¡intenta ser más específico!");
              return message.channel.send({ embed });
            } else {
              let length = roles.length > 9 ? 10 : roles.length,
                text = "Selecciona un número entre 1 y " + length + "```js\n";
              for (let i = 0; i < length; i++) {
                text += `${i + 1} - ${roles[i].name},\n`;
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
                });
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
                return await o(roles[index.first().content - 1]);
              }
            }
          }
          async function o(m) {
            if (dataroles.indexOf(role.id) < 0) {
              embed
                .setColor(message.colors.red)
                .setTitle(message.defaults.error)
                .setDescription("Ese rol no está en los auto-roles, verifica de nuevo usando `" + data.guild.prefix + "opciones auto-roles lista`")
              return message.channel.send({ embed });
            } else {
              embed
                .setColor(message.colors.green)
                .setTitle(message.defaults.done)
                .setDescription("El rol `" + m.name + "` ha sido removido de los auto-roles");
              message.channel.send({ embed });
              dataroles.splice(dataroles.indexOf(m.id), 1);
              data.guild.save();
              return;
            }
          }
        } else if (args[1].toLowerCase() === options[2]) {
          embed
            .setColor(message.colors.ginko)
            .setTitle(message.defaults.ginkoun + 'Lista de auto-roles');
          let x = '';
          for (let i = 0; i < dataroles.length; i++) {
            x += `${i + 1} - ${message.guild.roles.get(dataroles[i]).name}\n`;
          }
          embed.setDescription(x.length >= 2048 ? x.slice(0, 2045) + '...' : x);
          return message.channel.send({ embed });
        } else {
          embed
            .setColor(message.colors.red)
            .setTitle(message.defaults.error)
            .setDescription('Esa no es una opción válida, las opciones válidas son:\n`' + optionsJoin + '`')
          message.channel.send({ embed });
          return;
        }
      } else {
        embed
          .setColor(message.colors.red)
          .setTitle(message.defaults.error)
          .setDescription('Esa no es una opción válida, las opciones válidas son:\n`' + optionsJoin + '`')
        message.channel.send({ embed });
        return;
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