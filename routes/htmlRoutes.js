const moment = require('moment');
const db = require('../models');

module.exports = app => {
  // Home page
  app.get('/', function(req, res) {
    res.render('home', {
      title: 'Duckery - Home',
      css: ['styles.css', 'imports/bootstrap.min.css']
    });
  });

  // Chat page
  app.get('/chat', function(req, res) {
    db.Chat.findAll().then(logs => {
      let logsArr = [];
      for (let i = 0; i < logs.length; i++) {
        logs[i].dataValues.timestamp = moment(
          logs[i].dataValues.createdAt
        ).fromNow();
        logsArr.push(logs[i].dataValues);
      }
      res.status(200).render('chat', {
        title: 'Duckery - Chat',
        css: ['styles.css', 'chat.css', 'imports/bootstrap.min.css'],
        js: ['chat.js'],
        logs: logsArr,
        username: req.body.username
      });
    });
  });

  // Create duck page
  app.get('/duck/create', function(req, res) {
    res.render('createduck', {
      title: 'Duckery - Create A Duck',
      css: ['styles.css', 'imports/bootstrap.min.css'],
      js: ['imports/jcanvas.min.js', 'create-duck.js', 'index.js']
    });
  });

  // View duck page
  app.get('/viewduck/:id', function(req, res) {
    res.render('viewduck', {
      title: 'Duckery - View Duck',
      css: ['styles.css', 'imports/bootstrap.min.css'],
      js: [
        'bootstrap.bundle.js',
        'create-duck.js',
        'index.js',
        'jcanvas.min.js',
        'jquery.min.js',
        'view-duck.js'
      ],
      duck: res,
      id: req.params.id - 1
    });
  });

  //Minigames routes
  app.get('/minigames', function(req, res) {
    res.render('minigames', {
      title: 'Duckery - Minigames',
      css: ['styles.css', 'imports/bootstrap.min.css']
    });
  });

  app.get('/minigames/duckshot', function(req, res) {
    res.render('duckshot', {
      title: 'Duckery - Duckshot',
      css: ['styles.css', 'duckshot.css', 'imports/bootstrap.min.css']
    });
  });

  app.get('/minigames/askduck', function(req, res) {
    res.render('askduck', {
      title: 'Duckery - AskDuck',
      css: ['styles.css', 'askduck.css', 'imports/bootstrap.min.css'],
      js: ['askduck.js', 'imports/siriwave.min.js']
    });
  });

  app.get('/minigames/battleducks', function(req, res) {
    res.render('battleducks', {
      title: 'Duckery - BattleDucks',
      css: ['styles.css', 'battleducks.css', 'imports/bootstrap.min.css'],
      js: ['battleducks.js']
    });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404', {
      title: 'Duckery - 404',
      css: 'styles.css'
    });
  });
};
