const { Client, Collection, MessageEmbed } = require('discord.js');
const util = require('util');
const path = require('path');
const Neko = require('nekos.life');
const { sfw, nsfw } = new Neko();

module.exports = class client extends Client {
  constructor(options) {
    super(options);

    this.config = require('../main-config.js');

    this.commands = new Collection();

    this.aliases = new Collection();

    this.functions = require('./util/functions');

    this.guildsData = require('./Guild');

    this.membersData = require('./Member');

    this.usersData = require('./User');

    this.colors = {
      ginko: 0xd1dce1,
      green: 0x43b581,
      red: 0xf04947,
      gray: 0x747f8d,
      yellow: 0xf1c40f
    };
    this.tools = {
      sfw: sfw,
      nsfw: nsfw
    };
    this.defaults = {
      error: '<:au_MiscRedTick:599396704193740838> • ¡Error!',
      done: '<:au_MiscGreenTick:599396703732498452> • ¡Hecho!',
      noargs: '<:au_MiscRedTick:599396704193740838> • ¡Faltan argumentos!',
      awaitme: '¡No se recibió una respuesta!',
      ginkoun: '<:au_MiscGinkoTick:656156285049372692> • ',
      greenun: '<:au_MiscGreenTick:599396703732498452> • ',
      yellowun: '<:au_MiscYellowTick:650500183590830081> • ',
      grayun: '<:au_MiscGrayTick:599396703774310419> • ',
      redun: '<:au_MiscRedTick:599396704193740838> • '
    };
    this.regexs = {
      web: /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm,
      discord: /discord(?:app\\.com|\\.gg)[\\/invite\\/]?(?:(?!.*[Ii10OolL]).[a-zA-Z0-9]{5,6}|[a-zA-Z0-9\\-]{2,32})/,
      hexcolor: /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/
    };
    this.permissions = {
      CREATE_INSTANT_INVITE: 'Crear invitación instantánea',
      KICK_MEMBERS: 'Expulsar miembros',
      BAN_MEMBERS: 'Vetar miembros',
      ADMINISTRATOR: 'Administrador',
      MANAGE_CHANNELS: 'Gestionar canales',
      MANAGE_GUILD: 'Gestionar servidor',
      ADD_REACTIONS: 'Agregar reacciones',
      VIEW_AUDIT_LOG: 'Ver el registro de auditoría',
      VIEW_CHANNEL: 'Ver canal',
      SEND_MESSAGES: 'Enviar mensajes',
      SEND_TTS_MESSAGES: 'Enviar mensajes de texto a voz',
      MANAGE_MESSAGES: 'Gestionar mensajes',
      EMBED_LINKS: 'Insertar enlaces',
      ATTACH_FILES: 'Adjuntar archivos',
      READ_MESSAGE_HISTORY: 'Leer el historial de mensajes',
      MENTION_EVERYONE: 'Mencionar a todos',
      USE_EXTERNAL_EMOJIS: 'Usar emojis externos',
      CONNECT: 'Conectar',
      SPEAK: 'Hablar',
      MUTE_MEMBERS: 'Silenciar miembros',
      DEAFEN_MEMBERS: 'Ensordecer miembros',
      MOVE_MEMBERS: 'Mover miembros',
      USE_VAD: 'Usar actividad de voz',
      PRIORITY_SPEAKER: 'Prioridad de palabra',
      STREAM: 'En vivo',
      CHANGE_NICKNAME: 'Cambiar apodo',
      MANAGE_NICKNAMES: 'Gestionar apodos',
      MANAGE_ROLES: 'Gestionar roles',
      MANAGE_WEBHOOKS: 'Gestionar webhooks',
      MANAGE_EMOJIS: 'Gestionar emojis'
    };
  }

  loadCommands(commandPath, commandName) {
    try {
      const props = new (require(`.${commandPath}${path.sep}${commandName}`))(this);
      console.log(`Cargando comando: ${props.help.name} 👌`);
      props.config.location = commandPath;
      if (props.init) {
        props.init(this);
      }
      this.commands.set(props.help.name, props);
      props.config.aliases.forEach(alias => {
        this.aliases.set(alias, props.help.name);
      });
      return false;
    } catch (e) {
      console.error(e);
      return `No se pudo cargar el comando: ${commandName} Error: ${e}`;
    }
  }

  async unloadCommand(commandPath, commandName) {
    let command;
    if (this.commands.has(commandName)) {
      command = this.commands.get(commandName);
    } else if (this.aliases.has(commandName)) {
      command = this.commands.get(this.aliases.get(commandName));
    }
    if (!command) {
      return `¡El comando \`${commandName}\` no existe o no es un alias!`;
    }
    if (command.shutdown) {
      await command.shutdown(this);
    }
    delete require.cache[require.resolve(`.${commandPath}${path.sep}${commandName}.js`)];
    return false;
  }

  async postError(data) {
    let embed = new MessageEmbed().setColor(this.colors.red);

    if (data.type === 'command') {
      embed
        .addField('Error en', `Comando: \`${data.commandName}\``, true)
        .addField('Descripción', `\`\`\`coffescript\n${data.description}\`\`\``)
        .setFooter('Error ocurrido en ' + (data.message.guild ? data.message.guild.id + ' | ' + data.message.guild.name : 'DM | ' + data.message.author.tag));
      data.message.channel.send(
        new MessageEmbed()
          .setAuthor(data.message.author.tag, data.message.author.displayAvatarURL({ size: 2048 }))
          .setColor(this.colors.red)
          .addField('<:au_MiscRedTick:599396704193740838> • Un error (des)conocido ha ocurrido', 'Por favor contacta con el personal del bot para que se solucione lo más pronto posible\n[Servidor de soporte](' + this.config.misc.others.support + ')')
      );
    } else if (data.type === 'event') {
      embed.addField('Error en', `Evento: \`${data.eventName}\``, true).addField('Descripción', `\`\`\`coffescript\n${data.description}\`\`\``);
    }
    let channel = await this.channels.get('621114100868710402');
    channel.send(embed);
  }

  async findOrCreateUser(param, isLean) {
    let usersData = this.usersData;
    return new Promise(async function(resolve, reject) {
      let userData = isLean ? await usersData.findOne(param).lean() : await usersData.findOne(param);
      if (userData) {
        userData.save = async function() {
          await usersData.where({ _id: userData._id }).updateOne({ $set: userData });
          userData = await usersData.findOne(param).lean();
          return userData;
        };
        resolve(userData);
      } else {
        userData = new usersData(param);
        await userData.save();
        userData.save = async function() {
          await usersData.where({ _id: userData._id }).updateOne({ $set: userData });
          userData = await usersData.findOne(param).lean();
          return userData;
        };
        resolve(isLean ? userData.toJSON() : userData);
      }
    });
  }

  async findOrCreateMember(param, isLean) {
    let membersData = this.membersData;
    let guildsData = this.guildsData;
    return new Promise(async function(resolve, reject) {
      let memberData = isLean ? await membersData.findOne(param).lean() : await membersData.findOne(param);
      if (memberData) {
        memberData.save = async function() {
          await membersData.where({ _id: memberData._id }).updateOne({ $set: memberData });
          memberData = await membersData.findOne(param).lean();
          return memberData;
        };
        resolve(memberData);
      } else {
        memberData = new membersData(param);
        await memberData.save();
        memberData.save = async function() {
          await membersData.where({ _id: memberData._id }).updateOne({ $set: memberData });
          memberData = await membersData.findOne(param).lean();
          return memberData;
        };
        let guild = await guildsData.findOne({ id: param.guildID });
        if (guild) {
          guild.members.push(memberData._id);
          await guild.save();
        }
        resolve(isLean ? memberData.toJSON() : memberData);
      }
    });
  }

  async findOrCreateGuild(param, isLean) {
    let guildsData = this.guildsData;
    return new Promise(async function(resolve, reject) {
      let guildData = isLean
        ? await guildsData
            .findOne(param)
            .populate('membersData')
            .lean()
        : await guildsData.findOne(param).populate('membersData');
      if (guildData) {
        guildData.save = async function() {
          this.guildsData = guildsData;
          this.guildsData = guildsData;
          await this.guildsData.where({ _id: guildData._id }).updateOne({ $set: guildData });
          guildData = await this.guildsData.findOne(param).lean();
          return guildData;
        };
        resolve(guildData);
      } else {
        guildData = new guildsData(param);
        await guildData.save();
        guildData.save = async function() {
          this.guildsData = guildsData;
          await this.guildsData.where({ _id: guildData._id }).updateOne({ $set: guildData });
          guildData = await this.guildsData.findOne(param).lean();
          return guildData;
        };
        resolve(guildData.toJSON());
      }
    });
  }
};
