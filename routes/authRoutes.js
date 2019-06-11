const passport = require('passport');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const async = require('async');
const crypto = require('crypto');

const db = require('../models');

const saltRounds = 10;
const cssArray = ['styles.css', '/imports/bootstrap.min.css'];

module.exports = app => {
  // Login Page
  app.get('/login', function(req, res) {
    res.render('login', {
      title: 'Duckery - Login',
      css: cssArray
    });
  });

  // Login POST route
  app.post(
    '/login',
    passport.authenticate('local', {
      successRedirect: '/profile',
      failureRedirect: '/'
    })
  );

  // Sign up page
  app.get('/signup', function(req, res) {
    res.render('signup', {
      title: 'Duckery - Signup',
      css: cssArray
    });
  });

  // Logout page
  app.get('/logout', authenticationMiddleware(), function(req, res) {
    req.logout();
    req.session.destroy();
    res.redirect('/login');
  });

  // Profile page
  app.get('/profile', authenticationMiddleware(), function(req, res) {
    res.render('profile', {
      title: 'Duckery - Profile',
      css: cssArray
    });
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

  // Signup POST route
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

    let errors = req.validationErrors();

    if (errors) {
      console.log('Errors: ' + JSON.stringify(errors));
      res.render('signup', {
        title: 'Duckery - Signup',
        css: cssArray,
        errors: errors
      });
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
        })
          .then(function() {
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
          })
          .catch(err => {
            console.log(err);
            // var message = err.errors.map(error => {
            //   error.msg = error.message;

            //   if (error.message === 'email must be unique') {
            //     error.msg = 'Email is taken';
            //   } else if (error.message === 'username must be unique') {
            //     error.msg = 'Username is taken';
            //   }

            //   return error;
            // });
            console.log('Errors: ' + JSON.stringify(message));
            res.render('signup', {
              title: 'Duckery - Signup',
              css: cssArray,
              errors: []
            });
          });
      });
    }
  });

  // Forgot password page
  app.get('/forgot', function(req, res) {
    res.render('forgot', {
      title: 'Duckery - Forgot Password',
      css: cssArray
    });
  });

  // Forgot POST route
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
            user.save().then(function(user, err) {
              done(err, token, user);
            });
          });
        },
        function(token, user, done) {
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

  // reset GET route
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
        res.render('reset', {
          title: 'Duckery - Reset Password',
          css: cssArray,
          token: req.params.token
        });
      }
    });
  });

  // reset POST route
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
              res.render('/reset/:token', {
                title: 'Duckery - Reset Password',
                css: cssArray,
                errors: errors
              });
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
        if (err) {
          throw err;
        }
        res.redirect('/login');
      }
    );
  });
};
