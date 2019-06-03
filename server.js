require("dotenv").config();
var express = require("express");
var exphbs = require("express-handlebars");
var db = require("./models");
var app = express();
var PORT = process.env.PORT || 3000;
var expressValidator = require("express-validator");
var session = require("express-session");
var MySQLStore = require("express-mysql-session")(session);
var passport = require("passport");
var bcrypt = require("bcrypt");
var LocalStrategy = require("passport-local").Strategy;
var randomString = function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};
// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(expressValidator());

app.use(express.static("public"));

var options = {
  host: "localhost",
  port: 3306,
  user: "dderrickmatheww",
  password: "Blind5656!",
  database: "exampledb"
};

var sessionStore = new MySQLStore(options);

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
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

app.use(function(req, res, next) {
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
});
// Routes
// require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

passport.use(
  new LocalStrategy(function(username, password, done) {
    console.log(username);
    console.log(password);
    var db = require("./models");
    db.sequelize
      .query("SELECT id, password FROM users WHERE username = ?", {
        replacements: [username],
        type: db.sequelize.QueryTypes.SELECT
      })
      .then(function(result) {
        if (result.length === 0) {
          done(null, false);
        } else {
          var hash = result[0].password.toString();
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

var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
  syncOptions.force = true;
}

// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function() {
  app.listen(PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });
});

module.exports = app;
