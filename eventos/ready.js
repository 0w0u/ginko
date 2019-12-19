module.exports = class ReadyEvent {
  constructor(client) {
    this.client = client;
  }

  async run() {
    try {
      this.client.user.setActivity("¡En remodelación! https://glitch.com/~ginko-xyz");
    } catch (e) {
      console.log(e);
      this.client.postError({
        type: "event",
        eventName: "ready",
        description: e
      });
    }
  }
};
