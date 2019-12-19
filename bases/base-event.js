const { MessageEmbed } = require("discord.js");

module.exports = class Event {
  constructor(client) {
    this.client = client;
  }

  async run() {
    try {
      
    } catch (e) {
      console.log(e);
      this.client.postError({
        type: "event",
        eventName: "event",
        description: e
      });
    }
  }
};