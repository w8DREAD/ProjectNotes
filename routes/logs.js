const express = require('express');
const middleware = require('../auth');
const router = express.Router();
const control = require('../mvc/control');

router.get('/', middleware.auth(), middleware.async(async (req, res, next) => {
  res.render('logs', {
    username: req.user.username,
    like: await control.Like.takeRedis(`${req.user.email}`),
    login: true,
    addClassLogs: 'active',
  });
}));

module.exports = router;
