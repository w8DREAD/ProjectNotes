const express = require('express');
const middleware = require('../auth/middleware');

const router = express.Router();
const control = require('../mvc/control');

router.get('/', middleware(), (req, res, next) => {
  res.render('logs', {
    username: req.user.username,
    login: true,
    addClassLogs: 'active',
  });
});

module.exports = router;
