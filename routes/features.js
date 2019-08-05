const express = require('express');
const middleware = require('../auth/middleware');

const router = express.Router();
const mongo = require('../mongodb/mongo');

const control = require('../mvc/control');

router.get('/', middleware(), async (req, res, next) => {
  const users = await mongo.take('usersdb', 'users');
  console.log(users);
  res.render('features', {
    username: req.user.username,
    login: true,
    like: await control.Like.takeRedis('myLikes'),
    features: 'Тут будут фичи',
    addClassFeatures: 'active',
    users,
  });
});

module.exports = router;
