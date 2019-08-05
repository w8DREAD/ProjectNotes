const express = require('express');
const middleware = require('../auth/middleware');
const control = require('../mvc/control');
const router = express.Router();
const bodyParser = require('body-parser');

const app = express();

router.get('/', middleware(), async (req, res, next) => {
  res.render('index', {
    username: req.user.username,
    like: await control.Like.takeRedis('myLikes'),
    login: true,
    title: 'Заметки',
    addClassMain: 'active',
  });
});

module.exports = router;
