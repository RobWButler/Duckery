const db = require('../models');
const passport = require('passport');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

module.exports = function(app) {
  // Home page

  app.get('/', function(req, res) {
    res.render('chat');
    console.log(req.user);
    console.log(req.isAuthenticated());
  });

  app.get('/profile', authenticationMiddleware(), function(req, res) {
    res.render('profile');
  });

  // Chat page

  app.get('/chat', function(req, res) {
    res.render('chat');
  });

  // Login routes

  app.get('/login', function(req, res) {
    res.render('login');
  });

  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  );

  // Logout routes

  app.get('/logout', authenticationMiddleware(), function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
  });

  // Sign up routes

  app.get('/signup', function(req, res) {
    res.render('signup');
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

  //Forgot password routes

  app.get('/forgot', function(req, res) {
    res.render('forgot');
  });

  app.post('/forgot', function(req, res, next) {
    async.waterfall(
      [
        function(done) {
          crypto.randomBytes(10, function(err, buf) {
            var token = buf.toString('hex');
            done(err, token);
          });
        },
        function(token, done) {
          db.User.findOne({ where: { email: req.body.email } }).then(function(
            user
          ) {
            if (!user) {
              req.flash('error', 'No account with that email address exists.');
              return res.redirect('/forgot');
            }
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000;
            console.log(token);
            user.save().then(function(user, err) {
              console.log('got it');
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
          // console.log(token);
          console.log(user);
          var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'duckeryduckeryduckery@gmail.com',
              pass: 'Ducks4life!!'
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'duckeryduckeryduckery@gmail.com',
            subject:
              'Lets get quackin on reseting your password ' + user.username,
            text:
              'You are receiving this because you (or a hacker) have requested the reset of your current password with Duckery!' +
              '\n\n' +
              'Please click on the link below to reset your password!' +
              '\n\n' +
              'http://' +
              req.headers.host +
              '/reset/' +
              token +
              '\n\n' +
              'If you did not request this, please ignore!' +
              '\n\n' +
              'Thank you,' +
              '\n\n' +
              'The Duckery Team'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            console.log('mail-sent');
            req.flash(
              'success',
              'An email has been sent to ' +
                user.email +
                ' with further instructions.'
            );
            done(err, 'done');
          });
        }
      ],
      function(err) {
        if (err) {
          return next(err);
        } else {
          res.redirect('/forgot');
        }
      }
    );
  });

  app.get('/reset/:token', function(req, res) {
    db.User.findOne({
      where: {
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
      }
    }).then(function(user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired');
        return res.redirect('/forgot');
      } else {
        res.render('reset', { token: req.params.token });
      }
    });
  });

  app.post('/reset/:token', function(req, res) {
    async.waterfall(
      [
        function(done) {
          db.User.findOne({
            where: {
              resetPasswordToken: req.params.token,
              resetPasswordExpires: { $gt: Date.now() }
            }
          }).then(function(user) {
            if (!user) {
              req.flash(
                'error',
                'Password reset token is invalid or has expired.'
              );
              return res.redirect('back');
            }
            req
              .checkBody(
                'password',
                'Password must be between 8-100 characters long.'
              )
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
              .checkBody(
                'password2',
                'Password must be between 8-100 characters long.'
              )
              .len(8, 100);
            req
              .checkBody(
                'password2',
                'Passwords do not match, please try again.'
              )
              .equals(req.body.password);

            var errors = req.validationErrors();

            if (errors) {
              console.log('Errors: ' + JSON.stringify(errors));
              res.render('/reset/:token', { errors: errors });
            } else {
              bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if (err) {
                  throw err;
                }

                user.update({ password: hash }).then(function(user) {
                  user.resetPasswordToken = undefined;
                  user.resetPasswordExpires = undefined;

                  user.save().then(function(user) {
                    req.logIn(user, function(err) {
                      done(err, user);
                    });
                  });
                });
              });
            }
          });
        },
        function(user, done) {
          var smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'duckeryduckeryduckery@gmail.com',
              pass: 'Ducks4life!!'
            }
          });
          var mailOptions = {
            to: user.email,
            from: 'learntocodeinfo@mail.com',
            subject: 'Your password has been changed',
            text:
              'Hello,\n\n' +
              'This is a confirmation that the password for your account ' +
              user.email +
              ' has just been changed.\n'
          };
          smtpTransport.sendMail(mailOptions, function(err) {
            req.flash('success', 'Success! Your password has been changed.');
            done(err);
          });
        }
      ],
      function(err) {
        res.redirect('/login');
      }
    );
  });
  // Render 404 page for any unmatched routes
  app.get('*', function(req, res) {
    res.render('404');
  });
};
