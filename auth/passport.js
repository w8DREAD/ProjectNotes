const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authenticationMiddleware = require('./middleware');
const handler = require('../mvc/model');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

const initPassport = () => {
  passport.use(new LocalStrategy((username, password, done) => {
      const users = (async () => {
          return await handler.Users.takeFromDb()
      })
      console.log(users)
    let findUser;
    users.forEach((user) => {
      if (username === user.username && password === user.password) {
        findUser = user;
      }
    });
    if (findUser !== undefined) {
      return done(null, findUser);
    }
    return done(null, false);
        },
  ));

  passport.authenticationMiddleware = authenticationMiddleware;
};

module.exports = initPassport;