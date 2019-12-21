const path = require("path");

module.exports = class Command {
  constructor(client, {
      name = undefined,
      description = 'Descripción del comando',
      usage = prefix => '`Uso del comando`',
      examples = prefix => '`Ejemplo de uso`',
      enabled = true,
      ownerOnly = false,
      guildOnly = false,
      nsfwOnly = false,
      cooldown = 3000,
      aliases = new Array(),
      botPermissions = new Array(),
      memberPermissions = new Array(),
      dirname = undefined
    }) {
    this.client = client;
    let category = dirname ? dirname.split(path.sep)[parseInt(dirname.split(path.sep).length - 1, 10)] : 'Otro';
    this.config = {
      enabled,
      ownerOnly,
      guildOnly,
      nsfwOnly,
      cooldown,
      aliases,
      memberPermissions,
      botPermissions
    };
    this.help = { 
      name, 
      description, 
      category, 
      usage, 
      examples 
    };
  }
};
