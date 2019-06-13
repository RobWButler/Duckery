const exphbs = require('express-handlebars');
const express = require('express');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const cors = require('cors');
const flash = require('connect-flash');

const config = require('../config/config.js');

module.exports = app => {
  // Middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(expressValidator());

  // Handlebars
  app.engine(
    'handlebars',
    exphbs({
      defaultLayout: 'main'
    })
  );
  app.set('view engine', 'handlebars');

  // Cors
  const corsOptions = {
    origin: '*'
  };
  app.options('*', cors(corsOptions));

  app.use(express.static('public'));

  // Express session
  console.log(config.env);
  const sessionStore = new MySQLStore(config.env);
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

  // Flash
  app.use(flash());

  // Passport authentication check
  app.use(function(req, res, next) {
    res.locals.isAuthenticated = req.isAuthenticated();
    next();
  });

  return { passport };
};
