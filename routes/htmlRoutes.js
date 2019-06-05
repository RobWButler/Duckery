var db = require('../models');

module.exports = function(app) {
  // Load index page
  app.get('/', function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render('index', {
        msg: 'Welcome!',
        examples: dbExamples
      });
    });
  });

  // Load example page and pass in an example by id
  app.get('/duckshot', function(req, res) {
    res.render('duckshot', { style: 'duckshot' });
  });

  app.get('/askduck', function(req, res) {
    res.render('askduck', { style: 'askduck', script: 'askduck' });
  });

  app.get('/battleducks', function(req, res) {
    res.render('battleducks', { style: 'battleducks', script: 'battleducks' });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404');
  });
};
