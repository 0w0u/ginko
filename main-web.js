require('dotenv').config();
var express = require('express'),
  path = require('path'),
  config = require('./main-config.js'),
  session = require('express-session'),
  passport = require('passport'),
  { Strategy } = require('passport-discord'),
  app = express();

module.exports = class Web {
  constructor(client) {
    this.client = client;
    this.start();
  }
  start() {
    let client = this.client;
    app.engine('ejs', require('ejs').__express);
    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, '/web/rutas'));
    app.use(express.static(__dirname + '/web/public'));
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });
    var scopes = ['identify', 'guilds'];
    passport.use(
      new Strategy(
        {
          clientID: '621097720781996072',
          clientSecret: config.web.secret,
          callbackURL: config.web.url + 'callback',
          scope: scopes
        },
        function(accessToken, refreshToken, profile, done) {
          process.nextTick(function() {
            return done(null, profile);
          });
        }
      )
    );
    app.use(
      session({
        secret: 'satella',
        resave: false,
        saveUninitialized: false
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());
    app.get('/', function(req, res) {
      let loginstatus = true;
      if (!req.isAuthenticated()) {
        loginstatus = false;
      }
      res.render('paginas/indice', {
        client: client,
        isLogged: {
          status: loginstatus
        }
      });
    });
    app.get('/login', passport.authenticate('discord', { scope: scopes }), function(req, res) {});
    app.get('/callback', passport.authenticate('discord', { failureRedirect: '/' }), function(req, res) {
      res.redirect('/perfil');
    });
    app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
    });
    app.get('/perfil', checkAuth, function(req, res) {
      res.render('paginas/perfil', {
        userdata: req.user,
        ginkoavatar: client.user.displayAvatarURL()
      });
    });
    function checkAuth(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/');
    }
    app.listen(5000, function(err) {
      if (err) return console.log(err);
      console.log('Escuchando en 5000');
    });
  }
};
