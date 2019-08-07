const express = require('express');
const middleware = require('../auth/middleware');
const control = require('../mvc/control');

const router = express.Router();
const bodyParser = require('body-parser');
const mongo = require('../mongodb/mongo');

const app = express();

router.get('/', middleware(), async (req, res, next) => {
  // await control.Note.delete(14);
  res.render('index', {
    username: req.user.username,
    like: await control.Like.takeRedis('myLike'),
    login: true,
    title: 'Заметки',
    addClassMain: 'active',
  });
});

module.exports = router;
