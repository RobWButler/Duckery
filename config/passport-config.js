const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const db = require('../models');

module.exports = passport=> {
  passport.use(
    new LocalStrategy(function(username, password, done) {
      console.log(username);
      console.log(password);
      db.sequelize
        .query('SELECT id, password FROM users WHERE username = ?', {
          replacements: [username],
          type: db.sequelize.QueryTypes.SELECT
        })
        .then(function(result) {
          if (result.length === 0) {
            done(null, false);
          } else {
            const hash = result[0].password.toString();
            bcrypt.compare(password, hash, function(err, response) {
              if (response) {
                return done(null, { userId: result[0].id });
              } else {
                done(null, false);
              }
            });
          }
        });
    })
  );
};
