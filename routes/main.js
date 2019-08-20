const express = require('express');
const middleware = require('../auth');
const control = require('../mvc/control');

const router = express.Router();

router.get('/', middleware.auth(), middleware.async(async (req, res, next) => {
  res.render('main', {
    username: req.user.username,
    like: await control.Like.takeRedis(`${req.user.email}`),
    login: true,
    title: 'Заметки',
    addClassMain: 'active',
  });
}));

module.exports = router;
