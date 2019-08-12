const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const schemes = require('../schemes');

const app = express();
const control = require('../mvc/control');
const middleware = require('../auth/middleware');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


router.get('/', async (req, res, next) => {
  let userId;
  let name;
  let log = false;
  let likes = 0;

  if (req.user) {
    userId = req.user.id;
    log = true;
    name = req.user.username;
    await control.User.countLikes(userId);
    likes = await control.Like.takeRedis('myLike');
  }
  const notes = await control.Note.reproduce(userId) || [];
  res.render('notes', {
    username: name,
    login: log,
    like: likes,
    news: 'Тут будут новости',
    addClassNews: 'active',
    notes: notes.reverse(),
  });
});

module.exports = router;
