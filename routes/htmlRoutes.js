const db = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(app) {
  // Load index page
  app.get('/', function(req, res) {
    res.render('home', { style: 'styles' });
    console.log(req.user);
    console.log(req.isAuthenticated());
  });

  app.get('/profile', authenticationMiddleware(), function(req, res) {
    res.render('profile', { style: 'styles' });
  });

  app.get('/login', function(req, res) {
    res.render('login', { style: 'styles' });
  });

  app.get('/signup', function(req, res) {
    res.render('signup', { style: 'styles' });
  });

  // Chat page
  app.get('/chat', function(req, res) {
    res.render('chat');
  });

  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  );

  app.get('/logout', authenticationMiddleware(), function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
  });

  app.post('/signup', function(req, res) {
    req.checkBody('username', 'Username field cannot be empty.').notEmpty();
    req
      .checkBody('username', 'Username must be between 4-15 characters long.')
      .len(4, 15);
    req
      .checkBody('email', 'The email you entered is invalid, please try again.')
      .isEmail();
    req
      .checkBody(
        'email',
        'Email address must be between 4-100 characters long, please try again.'
      )
      .len(4, 100);
    req
      .checkBody('password', 'Password must be between 8-100 characters long.')
      .len(8, 100);
    req
      .checkBody(
        'password',
        'Password must include one lowercase character, one uppercase character, a number, and a special character.'
      )
      .matches(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.* )(?=.*[^a-zA-Z0-9]).{8,}$/,
        'i'
      );
    req
      .checkBody('password2', 'Password must be between 8-100 characters long.')
      .len(8, 100);
    req
      .checkBody('password2', 'Passwords do not match, please try again.')
      .equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
      console.log('Errors: ' + JSON.stringify(errors));
      res.render('signup', { errors: errors });
    } else {
      bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        if (err) {
          throw err;
        }
        // Store hash in your password DB.
        db.User.create({
          username: req.body.username,
          password: hash,
          email: req.body.email
        }).then(function() {
          db.sequelize
            .query('SELECT LAST_INSERT_ID() as userId')
            .then(function(result) {
              console.log(result[0]);
              var userId = result[0];
              console.log(userId);
              req.login(userId, function(err) {
                if (err) {
                  throw err;
                }
                res.redirect('/');
              });
            });
        });
      });
    }
  });

  passport.serializeUser(function(userId, done) {
    done(null, userId);
  });

  passport.deserializeUser(function(userId, done) {
    done(null, userId);
  });

  function authenticationMiddleware() {
    return (req, res, next) => {
      console.log(
        `req.session.passport.user: ${JSON.stringify(req.session.passport)}`
      );

      if (req.isAuthenticated()) {
        return next();
      }
      res.redirect('/');
    };
  }
  app.get('/minigames', function(req, res) {
    res.render('minigames', { style: 'styles' });
  });
  app.get('/duckshot', function(req, res) {
    res.render('duckshot', { style: 'duckshot' });
  });

  app.get('/createduck', function(req, res) {
    res.render('createduck', { style: 'styles' });
  });

  app.get('/viewduck/:id', function(req, res) {
    res.render('viewduck', {
      style: 'styles',
      duck: res,
      id: req.params.id - 1
    });
  });

  app.get('/askduck', function(req, res) {
    res.render('askduck', { style: 'askduck', script: 'askduck' });
  });

  app.get('/battleducks', function(req, res) {
    res.render('battleducks', { style: 'battleducks', script: 'battleducks' });
  });

  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404', { style: 'styles' });
  });
};
