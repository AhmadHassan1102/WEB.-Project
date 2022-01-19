const LocalStrategy = require('passport-local').Strategy;
//const bcrypt = require('bcryptjs');

// Load User model
const Role = require('../models/Role');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      Role.findOne({
        email: email
      }).then(role => {
        if (!role) {
          return done(null, false, { message: 'That email is not registered' });
        }
        //Match password
        console.log(role);
        if(role.password==password)
        {
          return done(null, role);
        }
        else
        {
          return done(null, false, { message: 'Password incorrect' });
        }
        
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    Role.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
