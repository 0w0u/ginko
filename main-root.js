const util = require('util'),
  fs = require('fs'),
  Client = require('./base/Ginko'),
  web = require('./main-web'),
  Web = new web(Client),
  readdir = util.promisify(fs.readdir),
  client = new Client({ ws: { properties: { $browser: 'Discord iOS' } } }),
  mongoose = require('mongoose'),
  init = async () => {
    let directories = await readdir('./comandos');
    directories.forEach(async dir => {
      let commands = await readdir('./comandos/' + dir + '/');
      commands
        .filter(cmd => cmd.split('.').pop() === 'js')
        .forEach(cmd => {
          const response = client.loadCommands('./comandos/' + dir, cmd);
          if (response) {
            console.log(response);
          }
        });
    });

    const evtFiles = await readdir('./eventos/');
    evtFiles.forEach(file => {
      const eventName = file.split('.')[0];
      const event = new (require(`./eventos/${file}`))(client);
      client.on(eventName, (...args) => event.run(...args));
      delete require.cache[require.resolve(`./eventos/${file}`)];
    });

    client.login(client.config.tokens.bot);

    setInterval(() => {
      Web.client = client;
    }, 5000);

    mongoose
      .connect(client.config.tokens.mongo, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => {
        console.log('¡Conectando con la base de datos!');
      })
      .catch(err => {
        console.log(
          '¡No se ha podido contectar a la base de datos!\nError:' + err
        );
      });
  };

init();
