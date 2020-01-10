module.exports = class ReadyEvent {
  constructor(client) {
    this.client = client;
  }
  async run() {
    try {
      let client = this.client;
      let array = [
        '💻 ~ ¡Código abierto! https://github.com/wwmon/ginko',
        '🥑 ~ Comiendo palta',
        '🥑 ~ Comiendo aguacate',
        '❤️ ~ Jugando con Charlotte',
        '🎉 ~ ¡Próspero año 2020!',
        '☔ ~ @' + this.client.user.tag,
        '🧩 ~ Atendiendo a ' + this.client.users.size + ' usuarios',
        '🧩 ~ Activa en ' + this.client.guilds.size + ' servidores'
      ];
      setInterval(() => {
        let index = Math.floor(Math.random() * (array.length - 1) + 1);
        client.user.setActivity(array[index]);
      }, 15000);
    } catch (e) {
      console.log(e);
      this.client.postError({
        type: 'event',
        eventName: 'ready',
        description: e
      });
    }
  }
};
