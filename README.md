# Passport Persona Express Module

This express module creates three endpoints to manage authentication
using the `Persona` service.

## INSTALL

`npm install x-persona --save`

## SETUP (example)

``` js
var authenticate = require('x-persona');

app.use(express.cookieParser());
app.use(express.session({ secret: 'secret foo'}));

// attach to the `_api/session` endpoint

app.use('/_api/session', authenticate('localhost', function(email, done) {
 nano.use(dbName).view('users', 'email', {key: email}, function(err, body) {
   if (err) { return done(err); }
   if (body.rows && body.rows.length === 0) { return done(new Error('not found!')); }
    done(null, { email: email, id: body.rows[0].value } );
  });
}));
```

## API

### LOGIN (PUT /_api/session)

When Persona returns an assertion value, you need to submit a PUT via an ajax call.  Passing a `JSON` doc with the assertion.

``` js
request(app)
  .put('/_api/session')
  .send({ 
    assertion: 'secret-assertion-data'
  });
```

### SESSION (GET /_api/session)

This api call will return the current session of the user logged into the system.

### LOGOUT (DELETE /_api/session)

This api call will perform a logout using the passport helper method.

## TEST

`npm test`

## FAQ

## LICENSE

MIT

## SUPPORT

## TODO

* add tests
* enable other passport strategies

