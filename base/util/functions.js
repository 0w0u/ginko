const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
module.exports = {
  async getUsersData(client, users) {
    return new Promise(async function(resolve, reject) {
      let usersData = [];
      for (let u of users) {
        let result = await client.usersData.find({ id: u.id });
        if (result[0]) {
          usersData.push(result[0]);
        } else {
          let user = new client.usersData({
            id: u.id
          });
          await user.save();
          usersData.push(user);
        }
      }
      resolve(usersData);
    });
  },
  getPrefix(message, data) {
    const mentionPrefix = new RegExp(`^<@!?${message.client.user.id}>`).exec(message.content);
    const prefixes = [`${mentionPrefix}`, message.guild ? data.guild.prefix : message.client.config.misc.prefix];
    let prefix = undefined;
    prefixes.forEach(p => {
      if (message.content.startsWith(p)) {
        message.guild ? (prefix = p) : (prefix = message.client.config.misc.prefix);
      }
    });
    return prefix;
  },
  toDate(date) {
    if (!date) {
      throw new Error('Necesitas introducir una fecha');
    } else if (typeof date !== 'date') {
      throw new TypeError('Necesita ser una fecha');
    } else {
      return date.toLocaleString().split(/,+/g)[0];
    }
  },
  msElapsed(duration) {
    if (!duration) {
      throw new Error('Necesitas introducir un número, en microsegundos');
    } else if (typeof duration !== 'number') {
      throw new TypeError('Necesita ser un número, en microsegundos');
    } else {
      let mstring = duration.toString();
      let milliseconds = parseInt((duration % 1000) / 100),
        seconds = Math.floor(duration / 1000),
        minutes = Math.floor(duration / (1000 * 60)),
        hours = Math.floor(duration / (1000 * 60 * 60)),
        days = Math.floor(duration / (1000 * 60 * 60 * 60)),
        months = Math.floor(duration / (1000 * 60 * 60 * 60 * 24)),
        years = Math.floor(duration / (1000 * 60 * 60 * 60 * 24 * 30));

      days = days < 10 ? '0' + days : days;
      hours = hours < 10 ? '0' + hours : hours;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      seconds = seconds < 10 ? '0' + seconds : seconds;
      if (duration >= 31536000000) {
        return `${days}/${months}/${years} | ${hours}:${minutes}:${seconds}`;
      } else if (duration >= 2628000000) {
        return `${days}/${months} | ${hours}:${minutes}:${seconds}`;
      } else if (duration >= 86400000) {
        return `${days} | ${hours}:${minutes}:${seconds}`;
      } else {
        return `${hours}:${minutes}:${seconds}`;
      }
    }
  }
};
