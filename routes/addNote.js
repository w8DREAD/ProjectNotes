const express = require('express');

const router = express.Router();
const control = require('../mvc/control');
const schemes = require('../schemes');
const middleware = require('../auth');

router.get('/', middleware.auth(), middleware.async(async (req, res, next) => {
  res.render('addNote', {
    login: true,
    like: await control.Like.takeRedis(`${req.user.email}`),
    username: req.user.username,
  });
}));


module.exports = router;
