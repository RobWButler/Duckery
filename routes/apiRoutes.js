var db = require('../models');

module.exports = function(app) {
  // Get all examples
  app.get('/api/ducks', function(req, res) {
    db.Duck.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.get('/api/ducks/:id', function(req, res) {
    db.Duck.findOne({ where: { id: req.params.id } }).then(function(
      dbExamples
    ) {
      res.json(dbExamples);
    });
  });

  // Create a new example
  app.post('/api/ducks', function(req, res) {
    db.Duck.create(req.body).then(function(dbExample) {
      res.json(dbExample);
    });
  });

  // Delete an example by id
  app.delete('/api/examples/:id', function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(
      dbExample
    ) {
      res.json(dbExample);
    });
  });
};
