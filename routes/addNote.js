const express = require('express');

const router = express.Router();
const control = require('../mvc/control');
const schemes = require('../schemes');
const middleware = require('../auth/middleware');

router.get('/', middleware(), async (req, res, next) => {
  res.render('addNote', {
    login: true,
    like: await control.Like.takeRedis('myLike'),
    username: req.user.username,
  });
});


module.exports = router;
