const db = require('../models');

module.exports = app => {
  // GET all ducks
  app.get('/api/ducks', function(req, res) {
    db.Duck.findAll().then(function(ducks) {
      res.json(ducks);
    });
  });

  // GET one duck by id
  app.get('/api/ducks/:id', function(req, res) {
    db.Duck.findOne({ where: { id: req.params.id } }).then(function(duck) {
      res.json(duck);
    });
  });

  // POST new duck
  app.post('/api/ducks', function(req, res) {
    db.Duck.create(req.body).then(function(duck) {
      res.json(duck);
    });
  });

  // Delete an example by id
  app.delete('/api/ducks/:id', function(req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function(duck) {
      res.json(duck);
    });
  });

  // Get Logged in User
  app.get('/api/get-user', (req, res) => {
    if (req.user) {
      return res.status(200).json({
        username: req.user.username,
        email: req.user.email
      });
    }
    return res.status(401).json({
      errorMsg: 'You are not logged in.'
    });
  });

  // GET chat data
  app.get('/api/chat', (req, res) => {
    db.Chat.findAll()
      .then(logs => {
        // console.log(logs);
        res.status(200).json(logs);
      })
      .catch(err => {
        if (err) {
          console.log(err);
        }
      });
  });

  // POST chat data
  app.post('/api/chat', (req, res) => {
    db.Chat.create({
      username: req.user.username,
      message: req.body.message
    }).catch(err => {
      if (err) {
        console.error(err);
      }
    });
  });
};
