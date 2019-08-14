const express = require('express');
const middleware = require('../auth/middleware');
const control = require('../mvc/control');

const router = express.Router();

router.get('/', middleware(), async (req, res, next) => {
  const userId = req.user.id;
  res.render('main', {
    username: req.user.username,
    like: await control.Like.takeRedis(`${userId}`),
    login: true,
    title: 'Заметки',
    addClassMain: 'active',
  });
});

module.exports = router;
