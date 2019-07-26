const express = require('express');
const control = require('../mvc/control');
const passport = require('passport');
const router = express.Router();
const middleware = require('../auth/middleware')

router.get('/register', (req, res, next) => {
  if(!req.isAuthenticated()) {
    res.render('register');
  } else {
    res.redirect('/api/v1/')
  }
});

router.get('/login', (req, res, next) => {
  if(!req.isAuthenticated()) {
    res.render('login');
  } else {
    res.redirect('/api/v1/')
  }
});

router.post('/register', async (req, res, next) => {
  const user = req.body;
  await control.User.create(user);
  res.redirect('/api/v1/users/login');
});

router.get('/logout', middleware(), (req, res) => {
  req.logout();
  res.redirect('/api/v1/users/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/api/v1/notes',
  failureRedirect: '/api/v1/register'
}));

module.exports = router;
