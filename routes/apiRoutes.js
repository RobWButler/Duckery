const db = require('../models');

module.exports = app => {
  // GET all ducks
  app.get('/api/ducks', function(req, res) {
    db.Duck.findAll({}).then(function(dbExamples) {
      res.json(dbExamples);
    });
  });

  // GET one duck by id
  app.get('/api/ducks/:id', function(req, res) {
    db.Duck.findOne({ where: { id: req.params.id } }).then(function(
      dbExamples
    ) {
      res.json(dbExamples);
    });
  });

  // POST new duck
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

  // Get Logged in User
  app.get('/chat/user', (req, res) => {
    res.json({
      reqUser: req.user,
      resUser: res.user,
      resSession: res.session
    });
  });
};
