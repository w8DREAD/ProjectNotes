const express = require('express');

const router = express.Router();

router.get('/registr', (req, res, next) => {
  res.render('registr');
});

router.get('/login', (req, res, next) => {
  res.render('login');
});

router.post('/', (req, res) => {
  console.log(req.body);
  res.send('post');
});

module.exports = router;
