const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs');
const Users = require('../models/users');
const jwtSecretKey = require('../json/jwtKey.json');

passport.use(
  new BasicStrategy(async function (username, password, done) {
    try {
      const user = await Users.findUserByUsername(username);

      if (user == undefined) {
        // Username not found
        console.log('HTTP Error Passport Basic username not found');
        return done(null, false);
      }

      /* Verify password match */
      if (bcrypt.compareSync(password, user.password) == false) {
        // Password does not match
        console.log('HTTP Error Passport Basic password not matching username');
        return done(null, false);
      }
      return done(null, user);
    } catch (error) {
      return done(null, false);
    }
  })
);

let options = {};

/* Configure the passport-jwt module to expect JWT
   in headers from Authorization field as Bearer token */
options.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();

/* This is the secret signing key.
   You should NEVER store it in code  */
options.secretOrKey = jwtSecretKey.key;

passport.use(
  new JwtStrategy(options, function (jwt_payload, done) {
    done(null, jwt_payload.user);
  })
);

module.exports = passport;
