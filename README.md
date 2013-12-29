# Passport Persona Express Module

This express module creates three endpoints to manage authentication
using the `Persona` service.

## USAGE

``` js
var authenticate = require('express-passport-persona');

// attach to the `_api/session` endpoint
app.use('/_api/session', authenticate('localhost', function(email, done) {
 nano.use(dbName).view('users', 'email', {key: email}, function(err, body) {
   if (err) { return done(err); }
   if (body.rows && body.rows.length === 0) { return done(new Error('not found!')); }
    done(null, { email: email, id: body.rows[0].value } );
  });
}));
```

## INSTALL

`npm install express-passport-persona --save`

## TEST

`npm test`

## FAQ

## LICENSE

MIT

## SUPPORT

## TODO

* add tests
* enable other passport strategies

