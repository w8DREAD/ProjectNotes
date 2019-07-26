const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const authenticationMiddleware = require('./middleware');
const handler = require('../mvc/model');

let findUser;

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(id, done) {

    return done(null, id);
});

const initPassport = () => {
  passport.use(new LocalStrategy( async (username, password, done) => {
      const users = await handler.Users.takeFromDb()
      console.log(users)
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