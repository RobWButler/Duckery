require('dotenv').config();
const express = require('express');

const exphbs = require('express-handlebars');

const db = require('./models');

const app = express();
const http = require('http').Server(app)
const io = require('socket.io')(http);
const PORT = process.env.PORT || 3000;


const expressValidator = require('express-validator');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const randomString = function makeid(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressValidator());

app.use(express.static('public'));

const options = {
  host: 'localhost',
  port: 3306,
  user: 'dderrickmatheww',
  password: 'Blind5656!',
  database: 'exampledb'
};

const sessionStore = new MySQLStore(options);

app.use(
  session({
    secret: randomString(10),
    resave: false,
    store: sessionStore,
    saveUninitialized: false
    // cookie: { secure: true }
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Handlebars
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
  })
);
app.set('view engine', 'handlebars');

// Sockets
io.on('connection', socket => {
  console.log('Socket made connection', socket.id);

  // Handle chat event
  socket.on('chat', data => {
    io.sockets.emit('chat', data);
  });

  // Handle typing event
  socket.on('typing', data => {
    socket.broadcast.emit('typing', data);
  });
});

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});

// Routes
// require('./routes/apiRoutes')(app);
require('./routes/htmlRoutes')(app);

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

let syncOptions = { force: false };
// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === 'test') syncOptions.force = true;
// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  http.listen(PORT, function() {
    console.log(
      '==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.',
      PORT,
      PORT
    );
  });
});

module.exports = app;
