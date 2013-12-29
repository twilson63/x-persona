var mockery = require('mockery');
var request = require('supertest');
var express = require('express');
var app = express();

// setup mock passport service
var foo;

mockery.registerMock('passport', {
  use: function(obj) {
    foo = obj;
  },
  initialize: function() {
    return function(req, res, next) {
      next();
    }
  },
  session: function() {
    return function(req, res, next) {
      req.isAuthenticated = function() {
        return true;
      };
      req.logout = function() {
        return true;
      };
      next();
    }
  },
  authenticate: function() {
    return function(req, res, next) {
      foo.fn('foo@email.com', function() {
        next();
      });
    }
  },
  serializeUser: function(fn) {},
  deserializeUser: function(fn) {}
});

// setup mock passport-persona service
mockery.registerMock('passport-persona', {
  Strategy: function(opts, authFn) {
    this.opts = opts;
    this.fn = authFn;
  }
});
mockery.enable({
    warnOnReplace: false,
    warnOnUnregistered: false
});

var authenticate = require('../');

describe('persona session endpoint module', function() {
  before(function() {
    app.use('/_api/session', authenticate('localhost', function(email, done) {
      process.nextTick(function() {
        done(null, { email: email });
      });
    }));
  });
  it('should login', function(done) {
    request(app)
      .put('/_api/session')
      .send({ 
        assertion: 'secret-assertion-data',
        audience: 'http%3A%2F%2Flocalhost:3000'
      })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('should get current session', function(done) {
    request(app)
      .get('/_api/session')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });
  it('should logout', function(done) {
    request(app)
      .del('/_api/session')
      .set('Accept', 'application/json')
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
  });

});