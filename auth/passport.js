const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const middleware = require('./middleware');
const handler = require('../mvc/model');

let findUser;

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((id, done) => done(null, id));

const initPassport = () => {
  passport.use(new LocalStrategy(async (username, password, done) => {
    const users = await handler.Users.takeFromDb();
    users.forEach((user) => {
      if (username === user.username && password === user.password) {
        findUser = user;
      }
    });
    if (findUser !== undefined) {
      return done(null, findUser);
    }
    return done(null, false);
  }));

  passport.middleware = middleware;
};

module.exports = initPassport;
