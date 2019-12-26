require('dotenv').config();
const { tokens } = require('./main-config.js'),
	phin = require('phin'),
	bodyParser = require('body-parser'),
	express = require('express'),
	app = express();

module.exports = class Web {
	constructor(client) {
		this.client = client;
		this.start();
	}

	start() {
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: false }));
		app.use(express.static('public'));
		app.set('json spaces', 2);

		app.get('/', function(request, response) {
			response.sendStatus(200);
		});
		app.get('/g', (req, res) => {
			res.redirect('https://glitch.com/edit/#!/ginko-xyz');
		});
		app.get('/donate/patreon', (req, res) => {
			res.redirect('https://www.patreon.com/ginkobot');
		});
		app.get('/donate/buymeacoffee', (req, res) => {
			res.redirect('https://www.buymeacoffee.com/ginkobot');
		});
		app.get('/donate/paypal', (req, res) => {
			res.redirect('https://www.paypal.me/ginkobot');
		});
		app.get('/invite', (req, res) => {
			res.redirect(
				'https://discordapp.com/oauth2/authorize?client_id=621097720781996072&scope=bot&permissions=2146958839'
			);
		});
		app.get('/support', (req, res) => {
			res.redirect('https://discordapp.com/invite/M8z4mgN');
		});
		app.get('/scripthub', function(request, response) {
			response.sendFile(__dirname + '/views/scripthub.html');
		});

		app.post('/wbl/dbl', async (req, res) => {
			if (
				!req.headers.authorization ||
				req.headers.authorization !== tokens.votes.password
			)
				return res.json({
					status: 400,
					message: 'Contraseña inválida'
				});

			let { user, bot } = req.body;

			let usuario =
				(await this.client.users.get(user)) ||
				(await this.client.fetchUser(user));

			let embed = {
				title: '¡Acaba de votar!',
				description:
					'[¡Vota por mí en **top.gg**!](https://top.gg/bot/621097720781996072/vote)',
				color: 3553599,
				author: {
					name: usuario.tag,
					icon_url: usuario.displayAvatarURL()
				}
			};

			await phin({
				url: tokens.votes.webhook,
				method: 'POST',
				data: {
					embeds: [embed],
					avatar_url: this.client.user.displayAvatarURL(),
					username: this.client.user.username
				}
			});

			res.json({
				status: 200,
				message: 'Voto registrado'
			});
		});

		const listener = app.listen(process.env.PORT, function() {
			console.log(
				'Tu aplicación está viendo peticiones en el puerto ' +
					listener.address().port
			);
		});
	}

	async reward(user) {}
};
