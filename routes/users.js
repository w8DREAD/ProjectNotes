const express = require('express');
const control = require('../mvc/control');
const passport = require('passport');

const router = express.Router();

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/register', async (req, res) => {
  const user = req.body;
  await control.User.create(user);
  res.redirect('/api/v1/users/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/api/v1/notes',
  failureRedirect: '/api/v1/register'
}));

module.exports = router;
