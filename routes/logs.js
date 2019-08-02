const express = require('express');
const middleware = require('../auth/middleware');

const router = express.Router();
const control = require('../mvc/control');

router.get('/', middleware(), async (req, res, next) => {
  res.render('logs', {
    username: req.user.username,
    like: await control.User.countLikes(req.user.id),
    login: true,
    addClassLogs: 'active',
  });
});

module.exports = router;
