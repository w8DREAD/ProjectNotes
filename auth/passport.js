const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const middleware = require('./middleware');
const handler = require('../mvc/model');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await handler.Users.takeFromDb(`SELECT rowid AS id, * FROM users WHERE rowid = ${id}`);
  done(null, user[0]);
});

const initPassport = () => {
  passport.use(new LocalStrategy(async (email, password, done) => {
    const user = await handler.Users.takeFromDb(`SELECT rowid AS id, * FROM users WHERE email = '${email}'`);
    if (!user[0]) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (user[0].password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user[0]);
  }));

  passport.middleware = middleware;
};

module.exports = initPassport;
