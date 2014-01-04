// x-persona
//
// Express Passport Persona Module
//
var express = require('express');
var app = express();
var passport = require('passport');
var PersonaStrategy = require('passport-persona').Strategy;

// USAGE:
//
// var authenticate = require('express-passport-persona');
// app.use(authenticate('localhost', function(email, done) {
//   nano.use(dbName).view('users', 'email', {key: email}, function(err, body) {
//     if (err) { return done(err); }
//     if (body.rows && body.rows.length === 0) { return done(new Error('not found!')); }
//     done(null, { email: email, id: body.rows[0].value } );
//   });
// }));
module.exports = function(audience, authenticate) {
  passport.use(new PersonaStrategy({ audience: audience }, authenticate));  
  
  app.use(express.cookieParser());
  // TODO enable session store config to be passed in 
  app.use(express.session({ secret: 'what does the fox say?'}));
  app.use(passport.initialize());
  app.use(passport.session());

  // app.configure(function() {
  // 
  // });

  var handleSuccess = function(req,res) { res.send(200, req.user); };
  var handleLogout = function(req, res) { req.logout(); res.send(200); };

  // GET Current Session
  app.get('/', ensureAuthenticated, handleSuccess);
  // PUT Persona Info -aka login
  // only works with json and ajax...
  app.put('/', express.json(), passport.authenticate('persona'), handleSuccess);
  // DELETE Session -aka logout
  app.del('/', ensureAuthenticated, handleLogout);

  // passport serialize methods
  passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user.email);
  });

  passport.deserializeUser(function(email, done) {
    done(null, { email: email });
  });

  // return module
  return app;
};

// validate authenticated user!
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(401);
}
