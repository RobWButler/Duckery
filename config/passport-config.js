const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

module.exports = passport => {
  // Used to auth login
  passport.use(
    new LocalStrategy(async function(username, password, done) {
      await db.User.findOne({
        attributes: ['id', 'password'],
        where: { username }
      })
        .then(function(dataValues) {
          const user = dataValues;

          if (!user) {
            return done(null, false);
          }

          const hash = user.password.toString();
          bcrypt.compare(password, hash, function(err, response) {
            if (err) {
              return console.error(
                `Error with bcrypt for user ${username}`,
                err
              );
            }
            if (response) {
              return done(null, user.id);
            } else {
              done(null, false);
            }
          });
        })
        .catch(err => {
          console.log(err);
        });
    })
  );

  passport.serializeUser(function(userId, done) {
    done(null, userId);
  });

  passport.deserializeUser(async function(userId, done) {
    const userQuery = await db.User.findOne({ where: { id: userId } }).catch(
      err => {
        console.log(err);
      }
    );
    const user = userQuery && userQuery.dataValues;
    // Remove user password from object for security
    if (user) {
      delete user.password;
    }

    done(null, user);
  });
};
