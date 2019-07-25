const express = require('express');

const router = express.Router();

router.get('/register', (req, res, next) => {
  res.render('register');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/register', (req, res) => {
  console.log(req.body);
  res.redirect('/api/v1/users/login');
});

module.exports = router;
