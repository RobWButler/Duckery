const exphbs = require('express-handlebars');
const express = require('express');
const expressValidator = require('express-validator');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');

const config = require('../config/config.js');

module.exports = app => {
  // Middleware
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());
  app.use(expressValidator());

  app.use(express.static('public'));

  const options = {
    host: config.env.host,
    port: config.env.port,
    user: config.env.username,
    password: config.env.password,
    database: config.env.database
  };

  // Express session
  const sessionStore = new MySQLStore(options);
  app.use(
    session({
      secret: config.env.session_secret,
      resave: false,
      store: sessionStore,
      saveUninitialized: false
      // cookie: { secure: true }
    })
  );

  // Passport
  app.use(passport.initialize());
  app.use(passport.session());

  // Handlebars
  app.engine(
    'handlebars',
    exphbs({
      defaultLayout: 'main'
    })
  );
  app.set('view engine', 'handlebars');

  // Passport authentication check
  app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });

  return { passport };
};
