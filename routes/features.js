const express = require('express');
const middleware = require('../auth');

const router = express.Router();
const mongo = require('../mongodb/mongo');

const control = require('../mvc/control');

router.get('/', middleware.auth(), middleware.async(async (req, res, next) => {
  // await control.User.activity();
  const userId = req.user.id;
  // const num = 5;
  // await control.Like.raiting();
  // const users = await mongo.take('users');
  // await control.Like.raiting(num);
  // const last10 = await mongo.take('users');
  // const myTags = await control.User.giveTags(userId);
  // const lastTags = await control.User.giveTags(userId, num);
  // console.log(await control.User.activity());
  // res.render('features', {
  //   //   username: req.user.username,
  //   //   login: true,
  //   //   like: await control.Like.takeRedis('myLike'),
  //   //   features: 'Рейтинг всех пользователей по набранным лайкам:',
  //   //   addClassFeatures: 'active',
  //   //   users,
  //   //   features2: `Рейтинг всех пользователей по набранным лайкам за последние ${num} заметок:`,
  //   //   myLastTag: `My tags last ${num} notes:`,
  //   //   last10,
  //   //   myTags,
  //   //   lastTags,
  //   //   activityUsers: await control.User.activity(),
  //   // });
  res.render('features', {
    username: req.user.username,
    login: true,
    like: await control.Like.takeRedis(`${userId}`),
    features: 'Рейтинг всех пользователей по набранным лайкам:',
    addClassFeatures: 'active',
  });
}));

module.exports = router;
