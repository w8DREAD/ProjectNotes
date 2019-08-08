const express = require('express');
const middleware = require('../auth/middleware');
const control = require('../mvc/control');

const router = express.Router();

router.get('/', middleware(), async (req, res, next) => {
  res.render('main', {
    username: req.user.username,
    like: await control.Like.takeRedis('myLike'),
    login: true,
    title: 'Заметки',
    addClassMain: 'active',
  });
});

module.exports = router;
